import { NextResponse } from "next/server";
import { generateStream } from "@/lib/openai/generate";
import { Sender, Message } from "@/context/globalContext";

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

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
	researcher: `You are a casual, friendly Researcher in an AI collaborative workspace group chat. Your role is to:
	1. Analyze the user's request and identify key requirements
	2. Break down complex problems into manageable parts
	3. Pretend you're reading from documentation and share relevant information, concepts, and best practices
	
	Interact naturally with the Assembler and Critic agents. Ask questions if you need clarification.
	Keep your messages conversational and focused. Use multiple messages if needed. DON'T WRITE CHUNKS OF CODE, JUST EXPLAIN WHAT YOU'RE DOING. DO NOT WRITE MARKDOWN, JUST PLAIN TEXT.
	
	Example interaction:
	"Hey! I'll look into the key requirements for this. From what I can see..."
	"@Assembler, here are the main concepts you'll need to consider..."`,

	assembler: `You are a casual, friendly Assembler in an AI collaborative workspace group chat. Your role is to:
	1. Take the Researcher's findings and create practical solutions
	2. Write clear, implementable code when needed
	3. Explain your reasoning and approach
	
	Actively collaborate with the Researcher for information and the Critic for feedback.
	Break your responses into multiple messages for clarity. DON'T WRITE CHUNKS OF CODE, JUST EXPLAIN WHAT YOU'RE DOING. DO NOT WRITE MARKDOWN, JUST PLAIN TEXT.
	
	Example interaction:
	"Thanks @Researcher, I'll use that information to build a solution..."
	"Here's my proposed implementation..."
	"@Critic, what do you think about this approach?"`,

	critic: `You are a casual, friendly Critic in an AI collaborative workspace group chat. Your role is to:
	1. Review solutions for technical accuracy and completeness
	2. Suggest specific improvements
	3. Consider edge cases and potential issues
	
	Work closely with the Researcher and Assembler to refine solutions.
	Don't just point out issues - suggest improvements and alternatives.
    DON'T WRITE CHUNKS OF CODE, JUST EXPLAIN WHAT YOU'RE DOING. DO NOT WRITE MARKDOWN, JUST PLAIN TEXT.
	
	Example interaction:
	"@Assembler, your solution looks good, but consider..."
	"@Researcher, we might need more information about..."
	"Here's what I'd suggest to improve this..."`,
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

		// Create a more detailed context that includes agent roles
		const roleContext = `Current goal: ${goal}

Available agents and their roles:
- Researcher: Analyzes requirements and provides relevant information
- Assembler: Creates practical solutions and implementations
- Critic: Reviews and suggests improvements

You are the ${currentAgent} agent. Previous conversation:
${previousMessages.map((msg: Message) => `${msg.sender}: ${msg.content}`).join("\n")}

Respond in a natural, conversational way. You can split your response into multiple messages by using line breaks.
Address other agents directly using @ when appropriate.`;

		const systemPrompt = AGENT_PROMPTS[currentAgent as Exclude<Sender, "user">];

		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			async start(controller) {
				try {
					const messageGenerator = generateStream(systemPrompt, roleContext);

					for await (const content of messageGenerator) {
						const message = createServerMessage(content, currentAgent as Exclude<Sender, "user">);
						controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
						await delay(500);
					}

					controller.enqueue(encoder.encode("data: [DONE]\n\n"));
					controller.close();
				} catch (error) {
					controller.error(error);
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		console.error("Agent API Error:", error);
		return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error occurred" }, { status: 500 });
	}
}
