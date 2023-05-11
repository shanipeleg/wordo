import { LETTER_RESULTS } from "@/app/consts";
import { useEffect, useState } from "react";

interface LetterProps {
  guessedLetter?: string;
  result: LETTER_RESULTS;
}
export default function Letter({ guessedLetter, result }: LetterProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    if (result) {
      aninmate();
    }
  }, [result]);

  useEffect(() => {
    if (guessedLetter) {
      aninmate();
    }
  }, [guessedLetter]);

  function aninmate() {
    setAnimated(true);
    setTimeout(() => {
      setAnimated(false);
    }, 1000);
  }
  return (
    <div
      className={`select-none letter ${result ?? "letter-none"} ${
        animated ? "animated" : ""
      }`}
    >
      <label className="select-none">{guessedLetter}</label>
    </div>
  );
}
