// app/[botId]/page.jsx (Server Component - no "use client")

import ChatPageClient from './ChatPageClient';

// Function to generate metadata dynamically
export async function generateMetadata({ params }) {
  const { botId } = params;
  
  // Fetch bot data or use botId to determine metadata
  const botData = await fetchChatbot(botId);
  
  return {
    title: botData?.metaTitle || `Agent`,
    description: botData?.metaDescription || `Interact with Agent`
  };
}

const fetchChatbot = async (botId) => {
  try {
    if (!botId) return null;

    // Use full URL for server-side fetch
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chatbot/get?chatbotId=${botId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch chatbot");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chatbot:", error);
    return null;
  }
};

export default function ChatPage({ params }) {
  return <ChatPageClient botId={params.botId} />;
}