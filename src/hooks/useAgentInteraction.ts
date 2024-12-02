import { useState } from "react";
import { useGlobalContext, createMessage, type Sender } from "@/context/globalContext";

const AGENT_ORDER: Exclude<Sender, "user">[] = ["researcher", "assembler", "critic"];

export function useAgentInteraction() {
	const { messages, setMessages, goal, setCurrentStage } = useGlobalContext();
	const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);

	const processNextAgent = async () => {
		if (isProcessing || !goal) {
			console.log("Skipping process - Processing:", isProcessing, "Goal:", goal);
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

			// Move to next agent or complete the interaction
			if (currentAgentIndex < AGENT_ORDER.length - 1) {
				setCurrentAgentIndex(currentAgentIndex + 1);
			} else {
				setCurrentStage("complete");
				setCurrentAgentIndex(0); // Reset for next interaction
			}
		} catch (error) {
			console.error("Agent processing error:", error);
			setMessages([...messages, createMessage("Sorry, I encountered an error processing your request.", "critic")]);
			setCurrentStage("complete");
			setCurrentAgentIndex(0); // Reset for next interaction
		} finally {
			setIsProcessing(false);
		}
	};

	return {
		processNextAgent,
		isProcessing,
		currentAgent: AGENT_ORDER[currentAgentIndex],
	};
}
