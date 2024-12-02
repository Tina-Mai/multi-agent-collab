"use client";
import { Info, Plus } from "lucide-react";
import Messages from "./messages";
import { useGlobalContext, createMessage } from "@/context/globalContext";
import { useState } from "react";

export default function MessagesApp() {
	const { messages, setMessages, currentStage, setCurrentStage, goal, setGoal } = useGlobalContext();
	const [input, setInput] = useState("");

	const startSimulation = (goal: string) => {
		// Empty for now - will be implemented later
		return goal;
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && input.trim() && currentStage === "asking") {
			// Create and add the user message
			const message = createMessage(input.trim(), "user");
			setMessages([...messages, message]);
			// Set the goal
			setGoal(input.trim());
			// Set stage to simulating
			setCurrentStage("simulating");
			// Start simulation
			startSimulation(input.trim());
			// Clear input
			setInput("");

			// Debug logs
			console.log("Message sent:", message);
			console.log("Current goal:", goal);
			console.log("Current messages:", messages);
		}
	};

	return (
		<div className="vertical relative self-center justify-self-center w-3/5 h-[62vh] bg-white backdrop-blur rounded-lg shadow-lg">
			{/* messages */}
			<Messages />

			{/* header */}
			<div className="absolute horizontal top-0 left-0 w-full items-center bg-gray-100/80 backdrop-blur-lg rounded-t-lg justify-between px-5 py-4 border-b border-gray-200 shadow-sm">
				<div className="horizontal items-center gap-5">
					<div className="horizontal items-center gap-3">
						<div className="size-3 bg-[#FF5F57] border border-[#E24238] rounded-full" />
						<div className="size-3 bg-[#FFBC2E] border border-[#F1A301] rounded-full" />
						<div className="size-3 bg-[#28C840] border border-[#16A085] rounded-full" />
					</div>
					<p className="text-sm text-gray-500">
						To: <span className="text-black pl-1">Agent Collaboration Workspace</span>
					</p>
				</div>
				<Info className="size-5 text-gray-400" />
			</div>

			{/* input */}
			<div className="absolute horizontal bottom-0 left-0 w-full items-center bg-white/80 backdrop-blur-lg rounded-b-lg px-5 py-4 gap-3">
				<div className="flex items-center justify-center bg-gray-200 rounded-full p-1">
					<Plus className="size-4 text-gray-500" />
				</div>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyPress}
					placeholder="What would you like the agents to help with?"
					className="w-full border border-gray-200 rounded-full px-3 py-1 text-sm outline-none"
				/>
			</div>
		</div>
	);
}
