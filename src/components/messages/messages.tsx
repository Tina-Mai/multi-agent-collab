"use client";

import { useGlobalContext, type Sender } from "@/context/globalContext";
import { useEffect, useRef } from "react";
import Image from "next/image";

// Profile images for each sender type
const profileImages: Record<Exclude<Sender, "user">, string> = {
	researcher: "/researcher-avatar.png",
	assembler: "/assembler-avatar.png",
	critic: "/critic-avatar.png",
};

export default function Messages() {
	const { messages } = useGlobalContext();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		console.log("Messages state updated:", messages);
	}, [messages]);

	return (
		<div className="vertical h-full overflow-y-auto p-4 gap-4 justify-end">
			{messages.length === 0 && <div className="flex-1" />}
			{messages.map((message) => {
				const isUser = message.sender === "user";

				return (
					<div key={message.id} className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
						{/* Profile picture for non-user messages */}
						{!isUser && (
							<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
								<Image src={profileImages[message.sender as Exclude<Sender, "user">]} alt={message.sender} width={32} height={32} />
							</div>
						)}

						<div className="vertical">
							{/* Sender name for non-user messages */}
							{!isUser && <span className="text-sm text-gray-500 mb-1 capitalize">{message.sender}</span>}

							{/* Message bubble */}
							<div
								className={`relative px-3 py-1 rounded-xl text-sm
									${isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"}`}
							>
								<p className="whitespace-pre-wrap break-words">{message.content}</p>
							</div>
						</div>
					</div>
				);
			})}
			<div ref={messagesEndRef} className="h-8" />
		</div>
	);
}
