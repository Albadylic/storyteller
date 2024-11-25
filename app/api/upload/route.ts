import OpenAI from "openai";
const openai = new OpenAI();
import { NextRequest } from "next/server";
import { AssistantResponse } from "ai";

const assistantId = process.env.OPEN_AI_ASSISTANT_ID;
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // const input: {
  //   threadId: string | null;
  //   message: string;
  // } = await req.json();

  const body = await req.json();

  const threadId = (await openai.beta.threads.create({})).id;

  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: body,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          assistantId ??
          (() => {
            throw new Error("Assistant ID is not defined");
          })(),
      });
      await forwardStream(runStream);
    }
  );
}
