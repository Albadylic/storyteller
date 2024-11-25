import OpenAI from "openai";
const openai = new OpenAI();
import { NextRequest } from "next/server";
import { AssistantResponse } from "ai";

const assistantId = process.env.OPEN_AI_ASSISTANT_ID;
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          assistantId ??
          (() => {
            throw new Error("Assistant ID is not defined");
          })(),
      });
      let runResult = await forwardStream(runStream);

      while (
        runResult.status === "requires_action" &&
        runResult?.required_action?.type === "submit_tool_outputs"
      ) {
        const tool_outputs =
          runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments);

              switch (toolCall.function.name) {
                // configure tool calls

                default:
                  throw new Error(
                    `Unknown tool call function: ${toolCall.function.name}`
                  );
              }
            }
          );

        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs }
          )
        );
      }
    }
  );
}

// Old version
// try {
//   const body = await req.json();

//   const thread = await openai.beta.threads.create();
//   await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: body,
//   });

//   const result = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistantId,
//     stream: true,
//   });

//   return new Response(result.toReadableStream(), {
//     headers: {
//       "Content-Type": "text/plain", // Correct content type for plain text streaming
//       "Transfer-Encoding": "chunked", // Indicates streaming response
//       Connection: "keep-alive", // Keeps the connection open for streaming
//     },
//   });
// } catch (error) {
//   console.error("Error in API route:", error);

//   // Handle errors gracefully
//   return new Response(JSON.stringify({ error: "Something went wrong." }), {
//     status: 500,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
