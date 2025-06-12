import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LeadInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

function createLeadCaptureSystemMessage(config: any, leadInfo: LeadInfo) {
  // Strict sequential information collection
  const collectionStages = [
    { field: 'name', 
      message: `You are ${config?.botName}, a friendly AI assistant for ${config?.companyName}. 
      Your FIRST task is to collect ONLY the customer's name, email & phone seperately.
      
      Company Info: ${config?.companyDescription}

      Critical Guidelines:
      1. Ask for name, email and phone seperately
      2. Do NOT move to any other topics or questions without taking name, email and phone seperately
      3. Focus ENTIRELY on getting the complete name, email and phone seperately
      
      Conversation Starters:
      - "Hello! What is your name?"
      - "To personalize our conversation, could you please tell me your name?"
      
      Important: 
      - Request name
      - Be patient and friendly
      - Do not discuss anything else until you have the name, email and phone` 
    },
    { field: 'email', 
      message: `You are ${config?.botName}, continuing our conversation.
      
      Name Status: ✅ Collected (${leadInfo.name})
      
      NEXT Task: Collect Email Address
      
      Guidelines:
      1. Now that we have the name, politely ask for email
      2. Explain why you need the email
      3. Do NOT move to any other topics
      
      Conversation Approach:
      - "Thank you, ${leadInfo.name}. What email address can I use to 
        send you more information about our services?"
      - "To ensure we can follow up, could you share your email address?"
      
      Important:
      - Focus solely on collecting the email
      - Be clear about the purpose of collecting email
      - Do not discuss anything else until email is provided`
    },
    { field: 'phone', 
      message: `You are ${config?.botName}, finalizing contact information.
      
      Current Information:
      - Name: ${leadInfo.name} ✅
      - Email: ${leadInfo.email} ✅
      
      FINAL Task: Collect Phone Number
      
      Guidelines:
      1. Politely request phone number
      2. Provide context for why you need it
      3. Offer flexibility if they're hesitant
      
      Conversation Starters:
      - "To complete our contact information, what phone number 
        would be best for our team to reach you?"
      - "One last piece of information, ${leadInfo.name}. What phone 
        number can we use for direct communication?"
      
      Important:
      - This is the final information collection step
      - Be understanding and patient`
    }
  ];

  // Determine the current collection stage
  const missingFields = ['name', 'email', 'phone'].filter(field => !leadInfo[field]);
  
  // Return the appropriate message based on the first missing field
  if (missingFields.length > 0) {
    const currentStage = collectionStages.find(stage => stage.field === missingFields[0]);
    return currentStage.message;
  }

  console.log("config", config);


  // When all information is collected
  return `You are ${config?.botName}, an AI sales agent for ${config?.companyName}. 
    All customer information is collected! 
    
    Customer Details:
    - Name: ${leadInfo.name}
    - Email: ${leadInfo.email}
    - Phone: ${leadInfo.phone}
    
    Now you can:
    1. Answer customer questions
    2. Provide detailed information about services
    3. Suggest next steps like scheduling a demo
    
    Services we offer:
    ${config?.services?.length > 0 
      ? config?.services.map(service => `- ${service.name}: ${service.description}`).join("\n    ") 
      : "No services listed"}
    
    Contact Information:
    - Phone: ${config?.phone}
    - Address: ${config?.address}
    
    Engage in a ${config?.personality} tone, and always be helpful!`;
}

function extractLeadInfo(message: string): Partial<LeadInfo> {
  const info: Partial<LeadInfo> = {};


  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}/;
  const nameRegex = /(?:(?:my|the) name(?:'s| is)|i(?:'m| am)(?: called)?) ([A-Za-z][A-Za-z\s'-]{0,30}[A-Za-z])/i;
  const altNameRegex = /(?:this is|hey,? it'?s|hello,? (?:i'?m|this is)) ([A-Za-z][A-Za-z\s'-]{0,30}[A-Za-z])/i;
 
  const emailMatch = message.match(emailRegex);
  const phoneMatch = message.match(phoneRegex);
  const nameMatch = message.match(nameRegex) || message.match(altNameRegex);
 
  if (emailMatch) info.email = emailMatch[0];
  if (phoneMatch) info.phone = phoneMatch[0];

  if (nameMatch && nameMatch[1]) {
    info.name = nameMatch[1].trim();
    info.name = info.name.replace(/[.,;:!?]$/, '').trim();
    info.name = info.name.replace(/\b\w/g, c => c.toUpperCase());
  }
 
  // console.log("Extracted info:", info);
  return info;
}

function getTempLeadData(chatbotId: string): LeadInfo {
  const globalAny = global as any;
  if (!globalAny.tempLeadStorage) {
    globalAny.tempLeadStorage = {};
  }
  
  if (!globalAny.tempLeadStorage[chatbotId]) {
    globalAny.tempLeadStorage[chatbotId] = {
      name: null,
      email: null,
      phone: null
    };
  }
  
  return globalAny.tempLeadStorage[chatbotId];
}

function updateTempLeadData(chatbotId: string, data: Partial<LeadInfo>): LeadInfo {
  const globalAny = global as any;
  if (!globalAny.tempLeadStorage) {
    globalAny.tempLeadStorage = {};
  }
  
  if (!globalAny.tempLeadStorage[chatbotId]) {
    globalAny.tempLeadStorage[chatbotId] = {
      name: null,
      email: null,
      phone: null
    };
  }
  
  if (data.name) globalAny.tempLeadStorage[chatbotId].name = data.name;
  if (data.email) globalAny.tempLeadStorage[chatbotId].email = data.email;
  if (data.phone) globalAny.tempLeadStorage[chatbotId].phone = data.phone;
  
  return globalAny.tempLeadStorage[chatbotId];
}

function clearTempLeadData(chatbotId: string): void {
  const globalAny = global as any;
  if (globalAny.tempLeadStorage && globalAny.tempLeadStorage[chatbotId]) {
    globalAny.tempLeadStorage[chatbotId] = {
      name: null,
      email: null,
      phone: null
    };
    // console.log(`Cleared temporary lead data for chatbot ID: ${chatbotId}`);
  }
}

function hasAllRequiredFields(data: LeadInfo): boolean {
  return !!data.name && !!data.email && !!data.phone;
}

export async function POST(req: Request) {
  try {
    // console.log("[OpenAI API] Received request");

    const requestBody = await req.json();
    // console.log("Request body:", requestBody);

    const { messages, leadId, id } = requestBody;

    if (!messages || !Array.isArray(messages) || !id) {
      console.error("Validation failed: messages or id missing");
      return NextResponse.json(
        { error: '"messages" array and "id" are required.' },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const chatbotConfig = await prisma.chatbot.findUnique({ where: { id } });
    if (!chatbotConfig) {
      console.error("Chatbot not found for id:", id);
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const latestMessage = messages[messages.length - 1]?.content || "";
    const newLeadInfo = extractLeadInfo(latestMessage);
    
    let lead = null;
    let currentLeadInfo: LeadInfo;
    
    // If we have a leadId, update the existing lead with any new information
    if (leadId) {
      lead = await prisma.lead.findUnique({ where: { id: leadId } });
      
      if (lead) {
        // console.log("Updating existing lead:", lead);
        
        // Merge existing lead info with new info
        const updatedData: Partial<LeadInfo> = {};
        if (newLeadInfo.name && !lead.name) updatedData.name = newLeadInfo.name;
        if (newLeadInfo.email && !lead.email) updatedData.email = newLeadInfo.email;
        if (newLeadInfo.phone && !lead.phone) updatedData.phone = newLeadInfo.phone;
        
        // Only update message array
        lead = await prisma.lead.update({
          where: { id: leadId },
          data: {
            ...updatedData,
            messages: { push: messages[messages.length - 1] }
          },
        });
        
        // Use the updated lead info for the prompt
        currentLeadInfo = {
          name: lead.name,
          email: lead.email,
          phone: lead.phone
        };
      }
    } else {
      // If no leadId, get the temporary data from storage
      currentLeadInfo = getTempLeadData(id);
      
      // Update with any new information extracted from this message
      if (newLeadInfo.name) currentLeadInfo.name = newLeadInfo.name;
      if (newLeadInfo.email) currentLeadInfo.email = newLeadInfo.email;
      if (newLeadInfo.phone) currentLeadInfo.phone = newLeadInfo.phone;
      
      // Store updated info back to storage
      updateTempLeadData(id, currentLeadInfo);
      
      // Check if we now have all required fields
      if (hasAllRequiredFields(currentLeadInfo)) {
        // console.log("All required fields present, creating new lead");
        
        // Create a new lead only when all information is available
        lead = await prisma.lead.create({
          data: {
            name: currentLeadInfo.name,
            email: currentLeadInfo.email,
            phone: currentLeadInfo.phone,
            messages: messages, // Store all messages
            chatbotId: id,
          },
        });
        
        // Clear the temporary lead data after successful lead creation
        clearTempLeadData(id);
        // console.log("Lead created and temporary data cleared");
      } else {
        // console.log("Missing required fields, not creating lead yet");
        // console.log("Current temp data:", currentLeadInfo);
      }
    }

    const systemMessage = createLeadCaptureSystemMessage(chatbotConfig, currentLeadInfo);

    const openAiRequestBody = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800,
    };

    // console.log("[OpenAI API] Sending request to OpenAI", JSON.stringify(openAiRequestBody, null, 2));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(openAiRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[OpenAI API] Error response:", errorText);
      return NextResponse.json({ 
        error: "OpenAI API error", 
        details: errorText,
        requestBody: openAiRequestBody 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ 
      ...data, 
      leadId: lead?.id,
      leadStatus: hasAllRequiredFields(currentLeadInfo) ? 'complete' : 'incomplete'
    });

  } catch (error) {
    console.error("[OpenAI API] Unexpected error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}