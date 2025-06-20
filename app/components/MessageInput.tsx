"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

export default function MessageInput() {
  const { sendMessage, isLoading, currentChatId, integration, chatbotdata } = useChat();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep focus on textarea always
  const maintainFocus = () => {
    if (textareaRef.current && document.activeElement !== textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Focus the textarea on mount and set interval to maintain focus
  useEffect(() => {
    // Initial focus
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Set up an interval to check and maintain focus
    const focusInterval = setInterval(maintainFocus, 100);
    
    // Clear interval on component unmount
    return () => clearInterval(focusInterval);
  }, []);
  
  // Explicitly focus after sending a message
  const handleSend = () => {
    if (message.trim() && !isLoading && currentChatId) {
      sendMessage(message);
      setMessage('');
      
      // Immediate focus
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [message]);

  // Reset message when switching chats
  useEffect(() => {
    setMessage('');
    
    // Focus when switching chats
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentChatId]);

  return (
    <div className="p-4 border-t border-gray-800"
    style={{backgroundColor: chatbotdata?.primaryColor}}
    >
      <div className="max-w-3xl mx-auto relative">
        <textarea
          ref={textareaRef}
          className="w-full text-white rounded-lg pl-4 pr-12 py-3 resize-none"
          placeholder="Enter Prompt..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          disabled={isLoading || !currentChatId}
          style={{backgroundColor: chatbotdata?.secondaryColor}}
        ></textarea>
        <button
          onClick={handleSend}
          disabled={isLoading || message.trim() === '' || !currentChatId}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-white
            ${(isLoading || message.trim() === '' || !currentChatId) ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:text-purple-400'}`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                transform="rotate(90 12 12)" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}