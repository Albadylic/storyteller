"use client";

import { useState, ChangeEvent } from "react";
import { useChat, useAssistant } from "ai/react";
import shrek from "./sources/Shrek";
// import Options from "./components/Options";
// import Characters from "./components/Characters";

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const { status, input, submitMessage, handleInputChange } = useAssistant({
    api: "/api/assistant",
  });

  const [optionsState, setOptionsState] = useState({
    genre: "",
    tone: "",
  });

  const [charactersState, setCharactersState] = useState({
    characters: [],
  });

  const [text, setText] = useState(shrek);

  const [loadingCharacters, setLoadingChracters] = useState(false);
  const [characters, setCharacters] = useState("Upload a file to continue");
  const [nodesWithEmbedding, setNodesWithEmbedding] = useState([]);

  function Options() {
    const genres = [
      { emoji: "🧙", value: "Fantasy" },
      { emoji: "🕵️", value: "Mystery" },
      { emoji: "💑", value: "Romance" },
      { emoji: "🚀", value: "Sci-Fi" },
    ];

    const tones = [
      { emoji: "😊", value: "Happy" },
      { emoji: "🤥", value: "Fable" },
      { emoji: "😭", value: "Tragic" },
      { emoji: "😂", value: "Funny" },
    ];

    const handleOptionsChange = ({
      target: { name, value },
    }: ChangeEvent<HTMLInputElement>) => {
      setOptionsState({
        ...optionsState,
        [name]: value,
      });
    };

    return (
      <>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
          <h3 className="text-xl font-semibold">Genre</h3>

          <div className="flex flex-wrap justify-center">
            {genres.map(({ value, emoji }) => (
              <div
                key={value}
                className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
              >
                <input
                  id={value}
                  type="radio"
                  value={value}
                  name="genre"
                  onChange={handleOptionsChange}
                />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
          <h3 className="text-xl font-semibold">Tones</h3>

          <div className="flex flex-wrap justify-center">
            {tones.map(({ value, emoji }) => (
              <div
                key={value}
                className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
              >
                <input
                  id={value}
                  type="radio"
                  name="tone"
                  value={value}
                  onChange={handleOptionsChange}
                />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  function Characters() {
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
                  // setNeedsNewIndex(true);
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
              setLoadingChracters(true);
              const result = await fetch("/api/upload", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: text,
                }),
              });

              const { error, payload } = await result.json();

              if (error) {
                setError(error);
              }

              if (payload) {
                setNodesWithEmbedding(payload.nodesWithEmbedding);
                setError("Success!");
              }

              setLoadingChracters(false);
            }}
          >
            Extract characters
          </button>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the story by selecting the genre and tone.
            </p>
          </div>

          <Options />
          {/* <Characters /> */}

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
                      // setNeedsNewIndex(true);
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
                  setLoadingChracters(true);
                  const result = await fetch("/api/upload", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(text),
                  });

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

                  setLoadingChracters(false);
                }}
              >
                Extract characters
              </button>
              <p>{characters}</p>
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || loadingCharacters}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a ${optionsState.genre} story in a ${optionsState.tone} tone. Include the following characters, if any are listed: ${charactersState.characters}`,
              })
            }
          >
            Generate Story
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>
        </div>
      </div>
    </main>
  );
}
