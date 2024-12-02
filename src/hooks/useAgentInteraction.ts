import { useState, useCallback } from "react";
import { useGlobalContext, createMessage, type Sender, type Message, MAX_MESSAGES } from "@/context/globalContext";

const AGENT_ORDER: Exclude<Sender, "user">[] = ["researcher", "assembler", "critic"];
const MAX_TURNS = 5;

export function useAgentInteraction() {
	const { messages, setMessages, goal, currentStage, setCurrentStage } = useGlobalContext();
	const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [turnCount, setTurnCount] = useState(0);

	const shouldEndConversation = useCallback(
		(message: string, messageCount: number) => {
			if (messageCount < 15 || turnCount < 2) return false;

			const completionPhrases = ["we've reached a good solution"];
			const questionPhrases = ["what do you think about the current solution", "any concerns"];
			const agreementPhrases = ["looks good to me", "i agree", "i'm satisfied", "no concerns"];
			const feedbackPhrases = ["should", "could you", "try to", "consider", "what about", "how about"];

			const lastFewMessages = messages.slice(-5);

			if (feedbackPhrases.some((phrase) => message.toLowerCase().includes(phrase))) {
				return false;
			}

			const hasAskedForOpinions = lastFewMessages.some((msg) => msg.sender === "critic" && questionPhrases.every((phrase) => msg.content.toLowerCase().includes(phrase)));

			const hasAgreements =
				hasAskedForOpinions &&
				lastFewMessages.some((msg) => msg.sender === "researcher" && agreementPhrases.some((phrase) => msg.content.toLowerCase().includes(phrase))) &&
				lastFewMessages.some((msg) => msg.sender === "assembler" && agreementPhrases.some((phrase) => msg.content.toLowerCase().includes(phrase)));

			return messageCount >= MAX_MESSAGES || (hasAgreements && completionPhrases.some((phrase) => message.toLowerCase().includes(phrase)));
		},
		[messages, turnCount]
	);

	const processNextAgent = useCallback(async () => {
		if (isProcessing || !goal) {
			console.log("Skipping process - Processing:", isProcessing, "Goal:", goal);
			return;
		}

		if (turnCount >= MAX_TURNS) {
			console.log("Maximum turns reached, ending conversation");
			setCurrentStage("complete");
			return;
		}

		try {
			setIsProcessing(true);
			const currentAgent = AGENT_ORDER[currentAgentIndex];

			console.log("Processing agent:", currentAgent, "with goal:", goal);

			const response = await fetch("/api/agents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					goal,
					currentAgent,
					previousMessages: messages,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				throw new Error("No response body");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			const receivedMessages: Message[] = [];

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const data = line.slice(5);
						if (data === "[DONE]") break;

						try {
							const message = JSON.parse(data) as Message;
							receivedMessages.push(message);
							setMessages((prev: Message[]) => [...prev, message]);

							if (message.sender === "critic" && shouldEndConversation(message.content, messages.length + receivedMessages.length)) {
								setCurrentStage("complete");
								return;
							}
						} catch (e) {
							console.error("Error parsing message:", e);
						}
					}
				}
			}

			if (currentStage !== "complete") {
				setCurrentAgentIndex((prevIndex) => (prevIndex + 1) % AGENT_ORDER.length);

				if (currentAgentIndex === AGENT_ORDER.length - 1) {
					setTurnCount((prev) => prev + 1);
				}
			}
		} catch (error) {
			console.error("Agent processing error:", error);
			setMessages((prev) => [...prev, createMessage("Sorry, I encountered an error processing your request.", "critic")]);
			setCurrentStage("complete");
		} finally {
			setIsProcessing(false);
		}
	}, [currentStage, currentAgentIndex, goal, isProcessing, messages, setCurrentStage, setMessages, shouldEndConversation, turnCount]);

	return {
		processNextAgent,
		isProcessing,
		currentAgent: AGENT_ORDER[currentAgentIndex],
	};
}
