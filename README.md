# Chat App

一个基于React和Express的实时聊天应用。

## 项目描述

这是一个现代化的Web聊天应用，提供实时消息交互功能。前端使用React构建用户界面，后端使用Express提供API服务。

## 功能特点

- 实时消息发送和接收
- 现代化的用户界面（使用Chakra UI）
- 响应式设计，支持多种设备
- WebSocket实时通信

## 技术栈

### 前端
- React 19
- Vite
- Chakra UI
- Socket.io-client

### 后端
- Node.js
- Express
- Socket.io
- CORS

## 开发环境设置

1. 克隆仓库：
```bash
git clone [repository-url]
cd chat-app
```

2. 安装依赖：
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

3. 启动开发服务器：
```bash
# 启动前端服务器
npm run dev

# 启动后端服务器（新终端）
cd server
npm run dev
```

## 部署

前端应用已配置为可以部署到Netlify，后端服务器可以部署到Railway或其他云平台。

## 环境变量

前端（.env）：
- VITE_API_URL：后端API的URL

后端（.env）：
- PORT：服务器端口
- CORS_ORIGIN：允许的前端域名

## 许可证

MIT
