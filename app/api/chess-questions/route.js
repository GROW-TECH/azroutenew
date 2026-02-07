import OpenAI from "openai";

export async function GET() {
  try {
    // 1. Make sure key exists
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // 2. Create client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3. Prompt
    const prompt = `
Generate 5 beginner chess multiple choice questions.
Return ONLY valid JSON in this format:

[
  {
    "question": "string",
    "options": ["A","B","C","D"],
    "correct": 0,
    "explanation": "string"
  }
]
`;

    // 4. Call OpenAI (latest API)
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // 5. Read text safely
    const output = response.output?.[0]?.content?.[0]?.text;

    if (!output) {
      throw new Error("No text returned from OpenAI");
    }

    // 6. Parse JSON
    const questions = JSON.parse(output);

    return Response.json(questions);
  } catch (error) {
    console.error("Chess API error:", error);

    return Response.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
