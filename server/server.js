import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
// 配置body-parser中间件
app.use(express.json());

// 配置CORS中间件
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://cerulean-piroshki-e8f994.netlify.app',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
}));

// 添加请求体解析错误处理
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    console.error('请求体解析错误:', err);
    return res.status(400).json({
      error: {
        message: '无效的JSON格式',
        type: 'SyntaxError',
        details: err.message
      }
    });
  }
  next(err);
});

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

app.get('/', (req, res) => {
  res.json({ status: 'Chat API Server is running' });
});

// 处理OPTIONS预检请求
app.options('/api/chat', (req, res) => {
  res.sendStatus(204);
});

// 验证请求体的函数
const validateRequestBody = (body) => {
  console.log('验证请求体:', typeof body, JSON.stringify(body));
  
  if (!body || Object.keys(body).length === 0) {
    throw new Error('请求体不能为空');
  }

  if (typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('请求体必须是一个有效的JSON对象');
  }

  const { message } = body;
  console.log('提取的消息:', typeof message, message);

  if (message === undefined || message === null) {
    throw new Error('消息内容不能为空');
  }

  if (typeof message !== 'string') {
    throw new Error('消息内容必须是字符串类型');
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    throw new Error('消息内容不能仅包含空白字符');
  }

  if (trimmedMessage.length > 2000) {
    throw new Error('消息内容不能超过2000个字符');
  }

  return trimmedMessage;
};

// 重试函数
const retryFetch = async (url, options, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error;
      if (error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

app.post('/api/chat', async (req, res) => {
  try {
    console.log('接收到原始请求:', {
      headers: req.headers,
      'Content-Type': req.get('Content-Type'),
      body: req.body,
      rawBody: req.rawBody
    });

    const contentType = req.get('Content-Type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('请求必须使用 application/json Content-Type');
    }

    if (!req.body || typeof req.body !== 'object') {
      throw new Error('无效的请求体格式');
    }

    const message = validateRequestBody(req.body);
    console.log('验证后的消息:', message);

    const response = await retryFetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
        model: 'deepseek-chat',
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Deepseek API错误:', errorData);
      
      // 根据不同的错误状态返回相应的错误信息
      switch (response.status) {
        case 401:
          throw new Error('API密钥无效或已过期');
        case 429:
          throw new Error('请求频率超限');
        case 500:
          throw new Error('Deepseek服务器内部错误');
        default:
          throw new Error(`API请求失败: ${errorData.error?.message || '未知错误'}`);
      }
    }

    const data = await response.json();
    console.log('Deepseek API响应:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('API响应格式无效');
    }

    const reply = {
      reply: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
    
    console.log('发送响应到客户端');
    res.json(reply);
  } catch (error) {
    console.error('Error in /api/chat:', error);
    const statusCode = error.status || 500;
    const errorResponse = {
      error: {
        message: error.message || '服务器内部错误',
        type: error.name || 'ServerError',
        details: error.details || null
      },
      timestamp: new Date().toISOString()
    };
    res.status(statusCode).json(errorResponse);
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 添加优雅关闭处理
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  // 如果在规定时间内没有完成关闭，则强制退出
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}