import { LETTER_RESULTS } from "@/app/consts";
import { MouseEventHandler, ReactElement } from "react";
import Image from "next/image";

interface KeyProps {
  letter: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  result: LETTER_RESULTS;
  icon?: ReactElement;
}
export default function key({ letter, onClick, result, icon }: KeyProps) {
  return (
    <div
      onClick={onClick}
      className={`key ${
        result ??
        "bg-gray-700 select-none hover:bg-gray-600 transition duration-500 transition ease-in-out"
      }`}
    >
      {icon ?? <label>{letter}</label>}
    </div>
  );
}
