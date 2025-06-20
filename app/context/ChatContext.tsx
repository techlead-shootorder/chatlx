"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chatbot, Lead, User } from '@prisma/client';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type Chat = {
  id: string;
  title: string; // First user message or generated title
  messages: Message[];
  createdAt: Date;
};

type Integration = {
  id: string;
  logo: String;
  primaryColor: String;
  secondaryColor: String;
  fontColor: String;
  chatbotId: String;
  domain: String;
  pills: Object;
  initialMessage: String;
  subText: String;
  phone: String;
};

type Chatbot = {
  id: string;
  companyName: string;
  companyDescription?: string;
  industry?: string;
  location?: string;
  operatingHours?: string;
  email?: string;
  phone?: string;
  address?: string;
  services?: Record<string, any>; // JSON structure (array/object)
  pricing?: string;
  serviceAreas?: string;
  botName: string;
  welcomeMessage?: string;
  subtext?: string;
  fallbackMessage?: string;
  personality?: string;
  howToUse?: string;
  pills?: Record<string, any>; // JSON structure for pills
  leads: Lead[];
  isDefault: boolean;
  createdBy?: string;
  user?: User;
  integrations: Integration[];
  createdAt: Date;
  isActive: boolean;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (message: string) => void;
  isLoading: boolean;
  botId: string | null;
  integration: Integration | null;
  chatbotdata: Chatbot | null;
  chats: Chat[];
  currentChatId: string | null;
  createNewChat: () => void;
  switchChat: (chatId: string) => void;
  isChatbotActive: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Generate a unique ID for new chats
const generateId = () => Math.random().toString(36).substring(2, 15);

export function ChatProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const botId = params?.botId as string || null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [chatbotdata, setChatbotdata] = useState<Chatbot | null>(null); // Changed to match the context value
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isChatbotActive, setIsChatbotActive] = useState(true);

  // Load chats from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined' && botId) {
      const savedChats = localStorage.getItem(`chats-${botId}`);
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt)
        }));
        setChats(parsedChats);
      }
    }
  }, [botId]);

  // fetch the data from chatbot schema
  useEffect(() => {
    const fetchChatbot = async () => {
      try {
        if (!botId) return; // Ensure botId is available

        const response = await fetch(`/api/chatbot/get?chatbotId=${botId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chatbot");
        }

        const data = await response.json();
        console.log("data", data);
        setChatbotdata(data);
        console.log("data.isActive", data.isActive);
        //condition to check if bot is active or inactive
        if (data.isActive === false) {
          setIsChatbotActive(false);
          return; // Stop further execution
        }
      } catch (error) {
        console.error("Error fetching chatbot:", error);
      }
    };

    fetchChatbot();
  }, [botId]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && botId && chats.length > 0) {
      localStorage.setItem(`chats-${botId}`, JSON.stringify(chats));
    }
  }, [chats, botId]);

  // Fetch integration data
  useEffect(() => {
    const fetchIntegration = async () => {
      if (!botId) return;
      try {
        const response = await fetch(`/api/customize/get?chatbotId=${botId}`);
        if (!response.ok) throw new Error('Failed to fetch integration data');
        const data = await response.json();

        setIntegration(data);
      } catch (error) {
        console.error("Error fetching integration:", error);
      }
    };

    fetchIntegration();
  }, [botId]);

  // Fetch initial welcome message and create initial chat if needed
  useEffect(() => {
    const fetchChatbotConfig = async () => {
      try {
        const response = await fetch(`/api/chatbot/config?botId=${botId}`);
        if (!response.ok) throw new Error('Failed to fetch chatbot config');
        const config = await response.json();
        const welcomeMessage = config.welcomeMessage || 'Hello! How can I assist you?';

        // If there are no chats or no current chat selected, create a new one
        if (chats.length === 0 || !currentChatId) {
          const newChatId = generateId();
          const newChat: Chat = {
            id: newChatId,
            title: 'New Chat',
            messages: [{ role: 'assistant', content: welcomeMessage }],
            createdAt: new Date()
          };

          setChats([newChat]);
          setCurrentChatId(newChatId);
          setMessages([{ role: 'assistant', content: welcomeMessage }]);
        } else {
          // If there's a current chat, load its messages
          const currentChat = chats.find(chat => chat.id === currentChatId);
          if (currentChat) {
            setMessages(currentChat.messages);
          } else {
            // If current chat not found, select the first chat
            setCurrentChatId(chats[0].id);
            setMessages(chats[0].messages);
          }
        }
      } catch (error) {
        console.log("Error fetching config:", error);
        const welcomeMessage = 'Hello! How can I assist you?';

        if (chats.length === 0 || !currentChatId) {
          const newChatId = generateId();
          const newChat: Chat = {
            id: newChatId,
            title: 'New Chat',
            messages: [{ role: 'assistant', content: welcomeMessage }],
            createdAt: new Date()
          };

          setChats([newChat]);
          setCurrentChatId(newChatId);
          setMessages([{ role: 'assistant', content: welcomeMessage }]);
        }
      }
    };

    fetchChatbotConfig();
  }, [botId, currentChatId]);

  // Update messages in the current chat whenever messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages, title: getChatTitle(messages) }
            : chat
        )
      );
    }
  }, [messages, currentChatId]);




  // Function to generate a title from the first user message
  const getChatTitle = (chatMessages: Message[]): string => {
    const firstUserMessage = chatMessages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      // Truncate to first 30 characters or first line
      const title = firstUserMessage.content.split('\n')[0].substring(0, 30);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }
    return 'New Chat';
  };

  const createNewChat = () => {
    fetchWelcomeMessage().then(welcomeMessage => {
      const newChatId = generateId();
      const newChat: Chat = {
        id: newChatId,
        title: 'New Chat',
        messages: [{ role: 'assistant', content: welcomeMessage }],
        createdAt: new Date()
      };

      setChats(prevChats => [newChat, ...prevChats]);
      setCurrentChatId(newChatId);
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    });
  };

  const fetchWelcomeMessage = async (): Promise<string> => {
    if (!botId) return 'Hello! How can I assist you?';

    try {
      const response = await fetch(`/api/chatbot/config?botId=${botId}`);
      if (!response.ok) throw new Error('Failed to fetch chatbot config');
      const config = await response.json();
      return config.welcomeMessage || 'Hello! How can I assist you?';
    } catch (error) {
      console.log("Error fetching welcome message:", error);
      return 'Hello! How can I assist you?';
    }
  };

  const switchChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) {
      return;
    }

    const userMessage = { role: 'user', content: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          id: botId
        }),
      });

      if (!response.ok) {
        throw new Error('API response error: ' + response.statusText);
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botResponse = data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error in chat flow:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      isLoading,
      botId,
      integration,
      chatbotdata,
      chats,
      currentChatId,
      createNewChat,
      switchChat,
      isChatbotActive
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}