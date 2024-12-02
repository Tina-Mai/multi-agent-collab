import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function* generateStream(systemPrompt: string, userPrompt: string) {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OpenAI API key is not configured");
	}

	const MAX_MESSAGES_PER_TURN = 5;
	const MIN_MESSAGE_LENGTH = 20;
	let messageCount = 0;
	const randomDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

	// Check if this is the critic agent
	const isCritic = systemPrompt.includes("You are a casual, friendly Critic");

	try {
		const stream = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			temperature: 0.7,
			max_tokens: 1000,
			stream: true,
		});

		let currentMessage = "";

		for await (const chunk of stream) {
			// Only apply message limit for non-critic agents
			if (!isCritic && messageCount >= MAX_MESSAGES_PER_TURN) break;

			const content = chunk.choices[0]?.delta?.content || "";
			currentMessage += content;

			if (content.includes("\n") || content.includes(".") || content.includes("?")) {
				if (currentMessage.trim().length >= MIN_MESSAGE_LENGTH) {
					await randomDelay();
					yield currentMessage.trim();
					currentMessage = "";
					messageCount++;
				}
			}
		}

		// Yield any remaining content as the last message
		if (currentMessage.trim().length >= MIN_MESSAGE_LENGTH && (isCritic || messageCount < MAX_MESSAGES_PER_TURN)) {
			await randomDelay();
			yield currentMessage.trim();
		}
	} catch (error) {
		console.error("OpenAI API Error:", error);
		throw error;
	}
}
