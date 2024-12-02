"use client";

import { useGlobalContext, type Sender } from "@/context/globalContext";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useAgentInteraction } from "@/hooks/useAgentInteraction";
import { AGENT_AVATARS } from "./constants";

function DoneMessage() {
	return (
		<>
			<div className={`flex items-end gap-3 flex-row`}>
				{/* Profile picture for non-user messages */}
				<div className="size-6 rounded-full overflow-hidden flex-shrink-0 max-w-96">
					<Image src={"/critic-avatar.png"} alt={"Critic profile pic"} width={32} height={32} priority />
				</div>

				<div className="vertical pt-3 max-w-96">
					{/* Sender name for non-user messages */}
					<span className="text-xs text-gray-500 mb-1 ml-2 capitalize">Critic</span>

					{/* Message bubble */}
					<div className={`relative px-3 py-1 rounded-xl text-sm bg-[#E8E7EA] text-black`}>
						<p className="whitespace-pre-wrap break-words">Here&apos;s the solution we&apos;ve reached!</p>
					</div>
					<div className={`relative horizontal px-4 py-2 rounded-xl text-sm bg-[#E8E7EA] text-black rounded-bl-none mt-0.5 items-center`}>
						<Image src={"/file.png"} alt={"File icon"} width={50} height={50} />
						<div className="vertical gap-0.5 mx-3">
							<p className="font-semibold text-[13px]">Programmers_Guide.txt</p>
							<p className="text-xs text-gray-500">Text Document · 6 KB</p>
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-center py-4 text-sm text-gray-500">
				<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">✓ Solution Complete</span>
			</div>
		</>
	);
}

export default function Messages() {
	const { messages, setGoal, currentStage, setCurrentStage } = useGlobalContext();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { processNextAgent, isProcessing } = useAgentInteraction();

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Start agent interaction when a new user message is added
	useEffect(() => {
		const lastMessage = messages[messages.length - 1];

		if (lastMessage?.sender === "user") {
			console.log("Setting goal:", lastMessage.content);
			setGoal(lastMessage.content);
			setCurrentStage("simulating");
		}
	}, [messages, setGoal, setCurrentStage]);

	// Process next agent when in simulation stage
	useEffect(() => {
		console.log("Stage:", currentStage, "Processing:", isProcessing);
		if (currentStage === "simulating" && !isProcessing) {
			processNextAgent();
		}
	}, [currentStage, isProcessing, processNextAgent]);

	return (
		<div className="vertical h-full overflow-y-auto p-4 gap-4 justify-end flex-1">
			<div className="flex-1 min-h-0">
				<div className="h-12" />
				{messages.length === 0 && <div className="flex-1" />}
				{messages.map((message) => {
					const isUser = message.sender === "user";

					return (
						<div key={message.id} className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
							{/* Profile picture for non-user messages */}
							{!isUser && (
								<div className="size-6 rounded-full overflow-hidden flex-shrink-0 max-w-96">
									<Image src={AGENT_AVATARS[message.sender as Exclude<Sender, "user">]} alt={message.sender} width={32} height={32} priority />
								</div>
							)}

							<div className="vertical pt-3 max-w-96">
								{/* Sender name for non-user messages */}
								{!isUser && <span className="text-xs text-gray-500 mb-1 ml-2 capitalize">{message.sender}</span>}

								{/* Message bubble */}
								<div
									className={`relative px-3 py-1 rounded-xl text-sm
										${isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"}`}
								>
									<p className="whitespace-pre-wrap break-words">
										{message.content.split(" ").map((word, index) =>
											word.startsWith("@") ? (
												<span key={index} className="text-blue-500 font-bold">
													{word}{" "}
												</span>
											) : (
												word + " "
											)
										)}
									</p>
								</div>
							</div>
						</div>
					);
				})}
				<DoneMessage />
				{currentStage === "complete" && <DoneMessage />}
				<div ref={messagesEndRef} className="h-16" />
			</div>
		</div>
	);
}
