import { useEffect, useState } from "react";

import Letter from "./letter";
import { LETTER_RESULTS } from "@/app/consts";

interface WordProps {
  word: string;
  inFocus: boolean;
  guessed: boolean;
  guesses: string[];
  warning: string;
  wordNumber: number;
  results: LETTER_RESULTS[];
}

export default function Word({
  word,
  guessed,
  inFocus,
  warning,
  guesses,
  results,
  wordNumber,
}: WordProps) {
  const [warningAnimation, setWarningAnimation] = useState(false);
  useEffect(() => {
    if (warning && inFocus) {
      setWarningAnimation(true);
      setTimeout(() => {
        setWarningAnimation(false);
      }, 1000);
    }
  }, [warning]);

  return (
    <div
      className={`word ${guessed ? "guessed-word" : ""} ${
        warningAnimation ? "warning-animation" : ""
      }
      ${guesses.join("") === word && guessed ? "won" : ""}`}
    >
      {guesses.map((letter, index) => (
        <Letter
          key={wordNumber + index}
          result={results[index]}
          guessedLetter={letter}
        />
      ))}
    </div>
  );
}
