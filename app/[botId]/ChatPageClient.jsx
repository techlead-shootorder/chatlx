// app/[botId]/ChatPageClient.jsx
"use client";

import React from 'react';
import { ChatProvider, useChat } from '../context/ChatContext';
import Sidebar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import MessageInput from '../components/MessageInput';
import ChatHeader from '../components/ChatHeader';

export default function ChatPageClient({ botId }) {
  return (
    <ChatProvider botId={botId}>
      <ChatPageContent />
    </ChatProvider>
  );
}

function ChatPageContent() {
  const { isChatbotActive } = useChat();

  console.log("isChatbotActive", isChatbotActive);

  // Show inactive message if chatbot is not active
  if (!isChatbotActive) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.768 0L3.045 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Chatbot Inactive</h2>
          <p className="text-gray-300 mb-6">
            This chatbot is currently inactive and unavailable for conversations. 
            Please contact the administrator or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show normal chat interface if active
  return (
    <div className="flex h-screen text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader />
        <ChatArea />
        <MessageInput />
      </div>
    </div>
  );
}