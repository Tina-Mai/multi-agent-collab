import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generate(systemPrompt: string, userPrompt: string): Promise<string[]> {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{ role: "user", content: userPrompt },
			],
			temperature: 0.8, // temperature for creativity control
			n: 1, // number of completions to generate
		});

		const content = response.choices[0].message.content || "No response generated.";
		return content.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
	} catch (error) {
		console.error("Error calling OpenAI API:", error);
		throw new Error("Failed to generate");
	}
}
