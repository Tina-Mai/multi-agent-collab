# Collaborative Knowledge Retrieval and Assembly within a Multi-Generative Agent Simulation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Note
For the scale of the project, we didn't get the chance to build a browser agent or web scraper to actually pull data from documentation online, so we stored local data for Flask, Tailwind, and Hugging Face documentation that the researcher agent has access to. In the future, there would be a more dynamic way for the researcher agent to access and read documentation.

## Test
We recommend testing with the prompt: "How do I set up a Flask app?"
