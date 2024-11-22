import OpenAI from "openai";
const openai = new OpenAI();
import { NextRequest } from "next/server";

const assistantId = process.env.OPEN_AI_ASSISTANT_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: body,
    });

    const result = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      stream: true,
    });

    return new Response(result.toReadableStream(), {
      headers: {
        "Content-Type": "text/plain", // Correct content type for plain text streaming
        "Transfer-Encoding": "chunked", // Indicates streaming response
        Connection: "keep-alive", // Keeps the connection open for streaming
      },
    });
  } catch (error) {
    console.error("Error in API route:", error);

    // Handle errors gracefully
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
