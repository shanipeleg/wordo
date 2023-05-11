"use client";

import { KEYS, LETTER_RESULTS } from "@/app/consts";
import Key from "./key";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface KeyboardProps {
  onClickKey: Function;
  guessedLetterResults: {
    [key: string]: LETTER_RESULTS;
  };
  includeSkip?: boolean;
}
export default function Keyboard({
  onClickKey,
  guessedLetterResults,
  includeSkip = false,
}: KeyboardProps) {
  const firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const thirdRow = [KEYS.ENTER, "Z", "C", "V", "B", "N", "M", KEYS.DEL];

  const rows = [firstRow, secondRow, thirdRow];

  return (
    <div className="board">
      {rows.map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.map((key) => (
            <Key
              key={key}
              onClick={() => onClickKey(key)}
              result={guessedLetterResults[key]}
              letter={key}
            />
          ))}
        </div>
      ))}
      {includeSkip ? (
        <div className="keyboard-row">
          <Key
            key={KEYS.SKIP}
            onClick={() => onClickKey(KEYS.SKIP)}
            result={guessedLetterResults[KEYS.SKIP]}
            icon={
              <div className="flex flex-col">
                <FontAwesomeIcon icon={faArrowRight} />
                Skip
              </div>
            }
            letter={KEYS.SKIP}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
