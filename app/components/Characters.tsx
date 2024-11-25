import { useAssistant } from "ai/react";
import shrek from "../sources/Shrek";
import { useState, ChangeEvent } from "react";

export default function Characters(charactersState, setCharactersState) {
  const { status, input, messages, submitMessage, handleInputChange } =
    useAssistant({
      api: "/api/assistant",
    });

  const [text, setText] = useState(shrek);

  // const [loadingCharacters, setLoadingChracters] = useState(false);
  const [characters, setCharacters] = useState("Upload a file to continue");

  return (
    <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
      <h3 className="text-xl font-semibold">Characters</h3>
      <div className="my-2 flex h-3/4 flex-auto flex-col space-y-2 p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
        <label htmlFor={"fileInput"}>Upload source text file:</label>
        <input
          id={"fileInput"}
          type="file"
          accept=".txt"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const fileContent = event.target?.result as string;
                setText(fileContent);
              };
              if (file.type != "text/plain") {
                console.error(`${file.type} parsing not implemented`);
                setText("Error");
              } else {
                reader.readAsText(file);
              }
            }
          }}
        />
        <button
          className="bg-emerald-500 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={async () => {
            // setLoadingChracters(true);
            const result = await fetch("/api/upload", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(text),
            });

            console.log({ messages });

            if (!result.body) {
              console.error("No body received from request.");
              return;
            }

            const reader = result.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let response = "";

            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                response += decoder.decode(value, { stream: true }); // Append chunk
              }
            } catch (error) {
              console.error("Error reading stream:", error);
            } finally {
              reader.releaseLock();
            }

            console.log("Full response:", response);

            setCharacters(response);

            // setLoadingChracters(false);
          }}
        >
          Extract characters
        </button>
        <p>{characters}</p>
      </div>
    </div>
  );
}
