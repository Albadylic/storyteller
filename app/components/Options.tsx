// Using this subcomponent directly in the page
// This abstraction may be implemented later

import { useState } from "react";

export default function Options() {
  const [optionsState, setOptionsState] = useState({
    genre: "",
    tone: "",
  });

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
  }: React.ChangeEvent<HTMLInputElement>) => {
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
