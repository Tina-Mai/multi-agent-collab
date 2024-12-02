import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generate(systemPrompt: string, userPrompt: string): Promise<string[]> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OpenAI API key is not configured");
	}

	try {
		console.log("Calling OpenAI API with:", {
			systemPrompt: systemPrompt.slice(0, 100) + "...",
			userPrompt: userPrompt.slice(0, 100) + "...",
		});

		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{ role: "user", content: userPrompt },
			],
			temperature: 0.7,
			max_tokens: 1000,
			n: 1,
		});

		if (!response.choices[0].message?.content) {
			throw new Error("No content in OpenAI response");
		}

		const content = response.choices[0].message.content;
		return content.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
	} catch (error) {
		console.error("OpenAI API Error:", error);
		throw error;
	}
}
