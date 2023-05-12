import { gameDataRow } from "@/app/consts";
import Word from "./word";

interface BoardProps {
  word: string;
  warning: string;
  data: gameDataRow[];
}

export default function Board({ word, data, warning }: BoardProps) {
  return (
    <div className="board">
      {data.map(({ number, guesses, inFocus, guessed, results }) => (
        <Word
          wordNumber={number}
          key={number}
          word={word}
          guessed={guessed}
          warning={warning}
          guesses={guesses}
          inFocus={inFocus}
          results={results}
        />
      ))}
    </div>
  );
}
