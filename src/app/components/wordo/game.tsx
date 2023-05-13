import { wordMap } from "./wordo";

interface GameProps {
  secondsLeft: number;
  wordState: string;
  word: wordMap;
}
export default function Game({ wordState, word, secondsLeft }: GameProps) {
  return (
    <div className="grid place-items-center h-[30rem] text-center">
      <div className={`word ${wordState}`}>
        {word.guessable.map((letter, index) => (
          <div
            className={`letter brightness-90 shadow-lg rounded-md select-none  ${
              word.indexes.includes(index)
                ? "text-white animation-pulse"
                : "text-gray-400"
            }`}
            key={(letter ?? "-") + index}
          >
            {letter}
          </div>
        ))}
      </div>
      <div className="centered xs:w-[15em]">Hint: {word.hint}</div>
      <div className="centered xs:w-[15em]">{secondsLeft} seconds left!</div>
    </div>
  );
}
