"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type Sender = "user" | "researcher" | "assembler" | "critic";
export type Stage = "asking" | "simulating" | "complete";

export interface Message {
	id: string;
	content: string;
	sender: Sender;
	timestamp: Date;
}

interface ContextValue {
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	currentStage: Stage;
	setCurrentStage: (stage: Stage) => void;
	goal: string;
	setGoal: (goal: string) => void;
}

const GlobalContext = createContext<ContextValue | null>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentStage, setCurrentStage] = useState<Stage>("asking");
	const [goal, setGoal] = useState("");

	return (
		<GlobalContext.Provider
			value={{
				messages,
				setMessages,
				currentStage,
				setCurrentStage,
				goal,
				setGoal,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}

export function useGlobalContext() {
	const context = useContext(GlobalContext);
	if (!context) throw new Error("useGlobalContext must be used within a GlobalProvider");
	return context;
}

export function createMessage(content: string, sender: Sender): Message {
	return {
		id: crypto.randomUUID(),
		content,
		sender,
		timestamp: new Date(),
	};
}
