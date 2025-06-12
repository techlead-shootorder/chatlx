// "use client";

// import React from 'react';
// import { useChat } from '../context/ChatContext';

// export default function ChatHeader() {
//   const { botId } = useChat();
  
//   return (
//     <div className="p-4 border-b border-gray-800">
//       <div className="max-w-3xl mx-auto flex items-center justify-between">
//         <h1 className="text-white text-lg font-medium">
//           {botId ? `Chatting with ${botId} Bot` : 'Oasis Assistant'}
//         </h1>
//         <div className="flex items-center space-x-1">
//           <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//           <span className="text-green-500 text-sm">Online</span>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'
import React from "react";
import { useChat } from '../context/ChatContext';
import { Sun } from "lucide-react";

const ChatHeader = () => {
   const { integration, chats, currentChatId, createNewChat, switchChat, botId, chatbotdata } = useChat();
  return (
    <div className="flex items-center justify-end p-4 border-b border-gray-800"
    style={{backgroundColor: integration?.primaryColor}}
    >

      {/* Theme Toggle Icon */}
      {/* <button className="text-yellow-500 hover:text-yellow-400 p-2">
        <Sun size={20} />
      </button> */}

      {/* Divider */}
      <div className="w-px h-6 bg-gray-600 mx-4"></div>

      {/* Sign-in Button */}
      <button className=" text-white font-medium px-4 py-2 rounded-full"
      style={{backgroundColor: integration?.secondaryColor}}
      >
        Sign in
      </button>
    </div>
  );
};

export default ChatHeader;