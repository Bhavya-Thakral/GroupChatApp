import React, {createContext, useState, useContext, useMemo} from 'react';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [pushNotificationToken, setPushNotificationToken] = useState(null);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      messages,
      setMessages,
      currentChat,
      setCurrentChat,
      pushNotificationToken,
      setPushNotificationToken,
    }),
    [currentUser, messages, currentChat],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
