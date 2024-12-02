import { useState, useCallback } from "react";
import { useGlobalContext, createMessage, type Sender, type Message } from "@/context/globalContext";

const AGENT_ORDER: Exclude<Sender, "user">[] = ["researcher", "assembler", "critic"];
const MAX_TURNS = 5;

export function useAgentInteraction() {
	const { messages, setMessages, goal, setCurrentStage } = useGlobalContext();
	const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [turnCount, setTurnCount] = useState(0);

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
						} catch (e) {
							console.error("Error parsing message:", e);
						}
					}
				}
			}

			// Move to next agent
			setCurrentAgentIndex((prevIndex) => (prevIndex + 1) % AGENT_ORDER.length);

			// Increment turn count when we complete a full cycle
			if (currentAgentIndex === AGENT_ORDER.length - 1) {
				setTurnCount((prev) => prev + 1);
			}

			// Check if we should end the conversation
			const lastMessage = receivedMessages[receivedMessages.length - 1]?.content.toLowerCase();
			if (lastMessage?.includes("that concludes") || lastMessage?.includes("we're done") || lastMessage?.includes("looks good") || turnCount >= MAX_TURNS - 1) {
				setCurrentStage("complete");
			}
		} catch (error) {
			console.error("Agent processing error:", error);
			setMessages((prev) => [...prev, createMessage("Sorry, I encountered an error processing your request.", "critic")]);
			setCurrentStage("complete");
		} finally {
			setIsProcessing(false);
		}
	}, [currentAgentIndex, goal, isProcessing, messages, setCurrentStage, setMessages, turnCount]);

	return {
		processNextAgent,
		isProcessing,
		currentAgent: AGENT_ORDER[currentAgentIndex],
	};
}
