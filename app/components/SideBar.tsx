"use client"
import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

export default function Sidebar() {
  const { integration, chats, currentChatId, createNewChat, switchChat, botId, chatbotdata } = useChat();
 
  //  console.log("integration table", integration);
  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  const [logoPath, setLogoPath] = useState('');
  const [loading, setLoading] = useState(true);

  console.log("chatbot data", chatbotdata);

  useEffect(() => {
    const chatbot_logos = JSON.parse(localStorage.getItem('chatbot_logos'));
    if (chatbot_logos && chatbot_logos.length > 0) {
      const foundLogo = chatbot_logos.find(item => item.chatbotId == botId);
      if (foundLogo) {
        console.log("logo found", foundLogo.imagePath);
        setLogoPath(foundLogo.imagePath);
      }
    }
    setLoading(false);
  }, [botId])

  // console.log("integration details", integration);

  return (
    <div className={`w-64 h-full border-r border-gray-800 flex flex-col`}
    style={{ backgroundColor: integration?.primaryColor }}
    >
      <div className="pt-4 px-4 border-b border-gray-800 flex justify-center items-center">
        {/* <div className="logo flex items-center bg-green-300 justify-center h-10"> */}
        {chatbotdata?.logo && (
          <div className="">
            <img
              src={chatbotdata?.logo}
              alt="logo"
              width={200}
             
            />
          </div>
        )}
        {/* </div> */}
      </div>

      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New chat
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-gray-500 text-sm mb-2">Recent Chats</h3>
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => switchChat(chat.id)}
              className={`flex items-center text-gray-300 p-2 rounded cursor-pointer `}
              style={{backgroundColor: integration?.secondaryColor}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate">{chat.title}</span>
                <span className="text-xs text-gray-500">{formatDate(chat.createdAt)}</span>
              </div>
            </div>
          ))}

          {chats.length === 0 && (
            <div className="text-gray-500 text-sm italic">No chat history yet</div>
          )}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-800">
        {chatbotdata ? <a href={`tel:${chatbotdata?.phone || ''}`} className=" text-white py-3 px-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: integration?.secondaryColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {chatbotdata?.phone ? chatbotdata?.phone : 'XXX-XXX-XXX'}
        </a> : (
          <div className="bg-purple-700 py-3 px-4 rounded-full flex items-center justify-center w-48 animate-pulse">
            <div className="h-5 w-5 bg-purple-600 rounded-md mr-2"></div>
            <div className="h-5 w-24 bg-purple-600 rounded-md"></div>
          </div>
        )}
      </div>
    </div>
  );
}