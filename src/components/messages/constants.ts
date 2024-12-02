export const AGENT_AVATARS = {
	researcher: "/researcher-avatar.png",
	assembler: "/assembler-avatar.png",
	critic: "/critic-avatar.png",
} as const;

export const INITIAL_PROMPT = `I'm a collaborative AI system that uses multiple agents to help solve your problems:

1. Researcher: Gathers relevant information
2. Assembler: Organizes the information into a solution
3. Critic: Reviews and improves the solution

How can I help you today?`;
