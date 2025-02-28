const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || '请求失败');
  }
  return response.json();
};

export const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }
};