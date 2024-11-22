import OpenAI from "openai";
const openai = new OpenAI();
import { NextRequest } from "next/server";

const assistantId = process.env.OPEN_AI_ASSISTANT_ID;

export async function POST(req: NextRequest) {
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

  const response = result.toReadableStream();

  return new Response(response, {
    headers: {
      "content-type": "text/plain",
      "transfers-encoding": "chunked",
      connection: "keep-alive",
    },
  });

  //NextResponse.json({ success: true, data: body });
}
