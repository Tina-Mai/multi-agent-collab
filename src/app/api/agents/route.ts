import { NextResponse } from "next/server";
import { generate } from "@/lib/openai/generate";
import { Sender, Message } from "@/context/globalContext";

// Server-side message creation function
function createServerMessage(content: string, sender: Exclude<Sender, "user">): Message {
	return {
		id: crypto.randomUUID(),
		content,
		sender,
		timestamp: new Date(),
	};
}

// System prompts for each agent
const AGENT_PROMPTS: Record<Exclude<Sender, "user">, string> = {
	researcher: `You are a Research Agent. Your role is to identify and extract relevant information for the given task.
  Keep responses focused and concise, highlighting key concepts and essential details.
  Format your response in clear, easy-to-read sections. Your response will be a message in a group chat, so keep it short, no markdown, use casual tone, and talk to the other agents directly.`,

	assembler: `You are an Assembly Agent. Your role is to take research information and compile it into a coherent, 
  well-structured response. Focus on clarity and logical flow. Include relevant code examples when appropriate. Your response will be a message in a group chat, so keep it short, no markdown, use casual tone, and talk to the other agents directly.`,

	critic: `You are a Critic Agent. Your role is to review the assembled response for:
  1. Technical accuracy
  2. Completeness
  3. Clarity and structure
  Provide specific feedback for improvements if needed. Your response will be a message in a group chat with the other agents, so keep it short, no markdown, use casual tone, and talk to the other agents directly.`,
};

export async function POST(req: Request) {
	try {
		if (!process.env.OPENAI_API_KEY) {
			console.error("OpenAI API key is not configured");
			return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
		}

		const body = await req.json();
		const { goal, currentAgent, previousMessages } = body;

		// Validate required fields
		if (!goal || !currentAgent || !previousMessages) {
			console.error("Missing required fields:", { goal, currentAgent, previousMessages });
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Validate agent type
		if (!AGENT_PROMPTS[currentAgent as Exclude<Sender, "user">]) {
			console.error("Invalid agent type:", currentAgent);
			return NextResponse.json({ error: "Invalid agent type" }, { status: 400 });
		}

		// Convert previous messages into a conversation context
		const context = previousMessages.map((msg: Message) => `${msg.sender}: ${msg.content}`).join("\n");

		const systemPrompt = AGENT_PROMPTS[currentAgent as Exclude<Sender, "user">];
		const userPrompt = `Goal: ${goal}\n\nPrevious conversation:\n${context}`;

		console.log("Generating response for:", {
			agent: currentAgent,
			goal,
			messagesCount: previousMessages.length,
		});

		const response = await generate(systemPrompt, userPrompt);

		if (!response) {
			console.error("Empty response from OpenAI");
			return NextResponse.json({ error: "Empty response from OpenAI" }, { status: 500 });
		}

		// Split response into separate messages
		const messages = response
			.split("\n")
			.filter((msg) => msg.trim())
			.map((content) => createServerMessage(content, currentAgent as Exclude<Sender, "user">));

		return NextResponse.json({ messages });
	} catch (error) {
		console.error("Agent API Error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error occurred" }, { status: 500 });
	}
}
