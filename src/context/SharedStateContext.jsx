import { createContext, useContext, useState } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [moments, setMoments] = useState([]);
  const [messages, setMessages] = useState([]);

  const addMoment = (moment) => {
    setMoments([moment, ...moments]);
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <SharedStateContext.Provider value={{ moments, addMoment, messages, addMessage }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};