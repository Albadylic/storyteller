// Legacy characters system

import { useState } from "react";

export default function Characters() {
  const characters = [
    { emoji: "👸", value: "Princess" },
    { emoji: "🐉", value: "Dragon" },
    { emoji: "👽", value: "Alien" },
    { emoji: "🐋", value: "Whale" },
  ];

  const [state, setState] = useState({
    characters: [],
  });

  const handleChange = ({
    target: { name, value, checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (checked) {
      setState({
        ...state,
        [name]: [...state[name], value],
      });
    } else {
      const index = state[name].indexOf(value);
      if (index > -1) {
        state[name].splice(index, 1);
      }
    }
  };

  return (
    <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
      <h3 className="text-xl font-semibold">Characters</h3>

      <div className="flex flex-wrap justify-center">
        {characters.map(({ value, emoji }) => (
          <div
            key={value}
            className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
          >
            <input
              id={value}
              type="checkbox"
              name="characters"
              value={value}
              onChange={handleChange}
            />
            <label className="ml-2" htmlFor={value}>
              {`${emoji} ${value}`}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
