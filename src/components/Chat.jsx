import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Container,
  useToast,
  Image,
  SimpleGrid,
  IconButton,
  Textarea,
  Avatar
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { chatService } from '../services/api';
import { useSharedState } from '../context/SharedStateContext';

const Chat = () => {
  const { messages, addMessage } = useSharedState();
  const [newMessage, setNewMessage] = useState('');
  const [moments, setMoments] = useState([]);
  const [newMomentText, setNewMomentText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast({
        title: '消息不能为空',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: '我',
      timestamp: new Date().toLocaleTimeString(),
      avatar: 'https://bit.ly/dan-abramov'
    };

    addMessage(userMessage);
    setNewMessage('');

    try {
      const { reply, timestamp } = await chatService.sendMessage(newMessage);
      
      const aiMessage = {
        id: Date.now(),
        text: reply,
        sender: 'Deepseek',
        timestamp: timestamp,
        avatar: 'https://www.deepseek.com/favicon.ico'
      };

      // 确保消息列表包含用户消息和AI回复
      addMessage(aiMessage);
    } catch (error) {
      toast({
        title: '发送消息失败',
        description: error.message || '请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setSelectedImages(selectedImages.filter(img => img.id !== id));
  };

  const handlePublishMoment = () => {
    if (!newMomentText.trim() && selectedImages.length === 0) {
      toast({
        title: '请输入文字或选择图片',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const moment = {
      id: Date.now(),
      text: newMomentText,
      images: selectedImages,
      timestamp: new Date().toLocaleString(),
    };

    setMoments([moment, ...moments]);
    setNewMomentText('');
    setSelectedImages([]);
  };

  return (
    <Box h="100vh" maxH="100vh" display="flex" flexDirection="column" bg="white" overflow="hidden">
      <Box
        p={3}
        borderBottom="1px"
        borderColor="gray.200"
        bg="white"
        position="sticky"
        top={0}
        zIndex={1}
      >
        <HStack spacing={3} align="center">
          <Avatar
            size="sm"
            name="Deepseek"
            src="https://www.deepseek.com/favicon.ico"
          />
          <Text fontWeight="medium">Deepseek AI</Text>
        </HStack>
      </Box>
      <Box flex="1" overflowY="auto" p={4} css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CBD5E0',
          borderRadius: '24px',
        },
      }}>
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <HStack
              key={message.id}
              spacing={2}
              alignSelf={message.sender === '我' ? 'flex-end' : 'flex-start'}
              flexDirection={message.sender === '我' ? 'row-reverse' : 'row'}
            >
              <Avatar
                size="sm"
                name={message.sender}
                src={message.avatar || 'https://bit.ly/broken-link'}
              />
              <Box
                p={3}
                bg={message.sender === '我' ? 'blue.100' : 'gray.100'}
                borderRadius="lg"
                maxW="70%"
              >
                <Text>{message.text}</Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {message.timestamp}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>
      <Box p={4} borderTop="1px" borderColor="gray.200" bg="white">
        <HStack spacing={3}>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button colorScheme="blue" onClick={handleSendMessage}>
            发送
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default Chat;