import { useState, useCallback } from "react";
import { useGlobalContext, createMessage, type Sender } from "@/context/globalContext";

const AGENT_ORDER: Exclude<Sender, "user">[] = ["researcher", "assembler", "critic"];
const MAX_TURNS = 5; // Maximum number of turns per agent to prevent infinite loops

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

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			// Add all new messages to the conversation
			setMessages([...messages, ...data.messages]);

			// Move to next agent
			setCurrentAgentIndex((prevIndex) => (prevIndex + 1) % AGENT_ORDER.length);

			// Increment turn count when we complete a full cycle
			if (currentAgentIndex === AGENT_ORDER.length - 1) {
				setTurnCount((prev) => prev + 1);
			}

			// Check if we should end the conversation
			const lastMessage = data.messages[data.messages.length - 1]?.content.toLowerCase();
			if (lastMessage?.includes("that concludes") || lastMessage?.includes("we're done") || lastMessage?.includes("looks good") || turnCount >= MAX_TURNS - 1) {
				setCurrentStage("complete");
			}
		} catch (error) {
			console.error("Agent processing error:", error);
			setMessages([...messages, createMessage("Sorry, I encountered an error processing your request.", "critic")]);
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
