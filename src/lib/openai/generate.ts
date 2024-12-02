import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function* generateStream(systemPrompt: string, userPrompt: string) {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OpenAI API key is not configured");
	}

	const randomDelay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

	try {
		console.log("Calling OpenAI API with:", {
			systemPrompt: systemPrompt.slice(0, 100) + "...",
			userPrompt: userPrompt.slice(0, 100) + "...",
		});

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
		let isInCodeBlock = false;
		let codeBlock = "";

		for await (const chunk of stream) {
			const content = chunk.choices[0]?.delta?.content || "";

			// Check for code block markers
			if (content.includes("```")) {
				isInCodeBlock = !isInCodeBlock;
				if (!isInCodeBlock && codeBlock) {
					// End of code block, yield it as a complete message
					await randomDelay();
					yield codeBlock.trim();
					codeBlock = "";
					continue;
				}
			}

			if (isInCodeBlock) {
				codeBlock += content;
				continue;
			}

			currentMessage += content;

			if (content.includes("\n") || content.includes(".") || content.includes("?")) {
				if (currentMessage.trim()) {
					await randomDelay();
					yield currentMessage.trim();
					currentMessage = "";
				}
			}
		}

		// Yield any remaining content
		if (codeBlock.trim()) {
			await randomDelay();
			yield codeBlock.trim();
		}
		if (currentMessage.trim()) {
			await randomDelay();
			yield currentMessage.trim();
		}
	} catch (error) {
		console.error("OpenAI API Error:", error);
		throw error;
	}
}
