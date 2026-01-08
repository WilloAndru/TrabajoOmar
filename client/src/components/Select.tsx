import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";

type Props = {
  onChange: (optionId: number) => void;
};

const options = [
  { id: 1, name: "Menor precio" },
  { id: 2, name: "Mayor precio" },
  { id: 3, name: "Menor precio por unidad" },
  { id: 4, name: "Mayor precio por unidad" },
];

export default function Select({ onChange }: Props) {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    onChange(selected.id);
  }, [selected]);

  return (
    <div className="relative font-bold w-45 text-left">
      <Listbox value={selected} onChange={setSelected}>
        <Listbox.Button className="w-full rounded border-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 border-gray-300 hover:bg-emerald-400">
          {selected.name}
        </Listbox.Button>

        <Listbox.Options className="absolute z-50 w-full mt-0.5 rounded border-2 bg-white dark:bg-gray-700 border-gray-300">
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              className="cursor-pointer px-4 py-2 hover:bg-emerald-400"
            >
              {option.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
