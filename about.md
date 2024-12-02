# Simulating Agent Interaction

## **Concept: Collaborative Knowledge Retrieval and Assembly**

### **Task**

Create a simple application where agents collaborate to write a short, basic guide or script for a common task (e.g., "How to center a div using CSS" or "Basic setup of a Flask app").

### **Agents**

1. **Researcher**: Fetches key concepts or information snippets from a static dataset (e.g., preloaded JSON files representing "documentation").
2. **Assembler**: Compiles information from the Researcher into a coherent response.
3. **Critic**: Reviews the compiled response for completeness or logical consistency.

### **Example Workflow**

1. **Prompt**: "Create a guide for setting up a Flask app."
2. **Agent Interactions**:
    - **Researcher**: Fetches Flask installation steps and a simple code snippet for a "Hello World" app from preloaded data.
    - **Assembler**: Combines the steps and code snippet into a draft guide.
    - **Critic**: Validates the guide by checking if it includes all essential parts (e.g., installation, running the server).
3. **Output**: A complete and reviewed guide.

---

## **Simplified Implementation**

### **Setup**

1. Create a JSON file containing pre-defined snippets of information (e.g., Flask setup steps, CSS syntax examples).
2. Use Python (or JavaScript if you prefer) to simulate agents interacting in a turn-based fashion.

### **Key Functionalities**

-   **Agent Communication**: Pass data between agents in a structured manner (e.g., a shared message queue or centralized function).
-   **Basic Logic**: Implement simple decision-making, e.g., the Critic asking the Researcher for missing details.

### **Tools**

-   OpenAI API call
-   Since the application is a web app, visualizing the communication by printing the messages exchanged between agents in a chat-style format.

---

## **Examples for Showcasing**

### **1. CSS Task**

-   **Prompt**: "How do I center a div using CSS?"
-   **Outcome**: A concise response detailing options like flexbox or grid, with code snippets.

### **2. Python Task**

-   **Prompt**: "Write a basic script to reverse a string in Python."
-   **Outcome**: A simple Python script with comments.

### **3. HTML Task**

-   **Prompt**: "Create a boilerplate HTML file with a linked CSS stylesheet."
-   **Outcome**: A basic HTML template.

---

## **How to Keep It Simple**

-   Use preloaded data to avoid needing internet access or scraping.
-   Hard-code agent "personalities" with specific behaviors (e.g., Researcher always retrieves exact matches).
-   Keep outputs short and directly tied to the input prompt.
