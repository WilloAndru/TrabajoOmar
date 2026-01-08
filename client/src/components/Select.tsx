import { Listbox } from "@headlessui/react";
import { useState } from "react";

const options = [
  { id: 1, name: "Menor precio" },
  { id: 2, name: "Mayor precio" },
];

export default function Select() {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative font-bold w-30 text-center">
      <Listbox value={selected} onChange={setSelected}>
        <Listbox.Button className="w-full rounded border-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 border-gray-300">
          {selected.name}
        </Listbox.Button>

        <Listbox.Options className="w-full absolute mt-0.5 dark:bg-gray-700 rounded border-2 border-gray-300 bg-white">
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-emerald-500"
            >
              {option.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
