// /api/chatbot/get/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const botId = searchParams.get("chatbotId");

    if (!botId) {
      return NextResponse.json({ error: "chatbotId is required" }, { status: 400 });
    }

    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: botId,
      },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    return NextResponse.json(chatbot);
  } catch (error) {
    console.error("Error fetching chatbot:", error);
    return NextResponse.json({ error: "Failed to fetch chatbot" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}