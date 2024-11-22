"use client";

import { useState, ChangeEvent } from "react";
import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// import Options from "./components/Options";
// import Characters from "./components/Characters";

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const [optionsState, setOptionsState] = useState({
    genre: "",
    tone: "",
  });

  const [charactersState, setCharactersState] = useState({
    characters: [],
  });

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
              // File handling logic will be added here
            }}
          />
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
          <Characters />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading}
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
