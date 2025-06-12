import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");
    let integration = null;
    
    if (chatbotId) {
      integration = await prisma.integration.findFirst({
        where: { chatbotId: chatbotId },
      });
    } 

    console.log("In backend ", integration);

    return NextResponse.json(integration, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}