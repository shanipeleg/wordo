"use client";
import { useEffect, useState } from "react";
import Board from "./board";
import Keyboard from "../shared/keyboard";
import words from "../../words.json";
import { useCookies } from "react-cookie";
import { LETTER_RESULTS, freshGameState, KEYS } from "@/app/consts";
import useKeyPress from "@/app/hooks/useKeyPress";
import getRandomWord from "@/app/utils/getRandomWord";
export interface gameDataRow {
  inFocus: boolean;
  guesses: string[];
  number: number;
  guessed: boolean;
  results: LETTER_RESULTS[];
}

export default function Wordle() {
  const [data, setData] = useState<gameDataRow[]>(freshGameState);
  const [gameRunning, setGameRunning] = useState(true);
  const [wordOfTheGame, setWordOfTheGame] = useState<string>("");
  const [warning, setWarning] = useState<string>("");
  const [cookies, setCookie] = useCookies(["stats"]);
  const [guessedLetterResults, setGuessedLetterResults] = useState<{
    [key: string]: LETTER_RESULTS;
  }>({});

  useKeyPress((keyPressed: string) => {
    handleClickKey(keyPressed);
  }, data);

  function handleClickKey(key: string) {
    if (!gameRunning) return;
    setWarning("");
    const indexOfWord = data.findIndex((word) => word.inFocus);
    const word = data[indexOfWord].guesses;
    const indexOfLetter = word.findIndex((letter) => letter === "");
    const updatedData = [...data];

    if (key === KEYS.ENTER) {
      handleEnter(indexOfWord, word, indexOfLetter, updatedData);
      return;
    }

    updatedData[indexOfWord] = {
      ...updatedData[indexOfWord],
      guesses: [...updatedData[indexOfWord].guesses],
    };

    if (key === KEYS.DEL) {
      const indexToDelete = indexOfLetter === -1 ? 4 : indexOfLetter - 1;
      updatedData[indexOfWord].guesses[indexToDelete] = "";
    } else {
      if (indexOfLetter !== -1) {
        updatedData[indexOfWord].guesses[indexOfLetter] = key;
      }
    }

    setData(updatedData);
  }

  function resetGame() {
    setGameRunning(true);
    setData(freshGameState);
    setWordOfTheGame(getRandomWord(words));
    setGuessedLetterResults({});
  }

  function handleEnter(
    indexOfWord: number,
    word: string[],
    indexOfLetter: number,
    updatedData: gameDataRow[]
  ) {
    if (indexOfLetter !== -1) {
      setWarning("Not enough letters!");
      return;
    }

    const guessedWord = word.join("");
    if (!words.includes(guessedWord)) {
      setWarning("Word does not exist!");
      return;
    }

    updatedData[indexOfWord] = {
      ...updatedData[indexOfWord],
      guessed: true,
      inFocus: false,
      results: calculateWordResults(guessedWord, wordOfTheGame),
    };

    if (updatedData.length - 1 !== indexOfWord) {
      updatedData[indexOfWord + 1] = {
        ...updatedData[indexOfWord + 1],
        inFocus: true,
      };
    }

    setData(updatedData);

    if (
      guessedWord === wordOfTheGame ||
      indexOfWord === updatedData.length - 1
    ) {
      setGameRunning(false);
    }
  }

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (!gameRunning) {
      let won = false;
      let winningNumber: number | null = null;
      data.forEach((gameDataRow) => {
        if (gameDataRow.guesses.join("") === wordOfTheGame) {
          won = true;
          winningNumber = gameDataRow.number;
          setCookie("stats", { won, winningNumber, wordOfTheGame });
          console.log("Won in " + winningNumber);
        }
      });
    }
  }, [data, gameRunning]);

  function calculateWordResults(
    guessedWord: string,
    wordOfTheGame: string
  ): LETTER_RESULTS[] {
    const result: LETTER_RESULTS[] = [];
    let updateGuessedLetterResults = { ...guessedLetterResults };
    guessedWord.split("").forEach((guessedLetter, index) => {
      let outcome = LETTER_RESULTS.WRONG;

      const lettersOfWordOfTheGame = wordOfTheGame.split("");
      if (guessedLetter === wordOfTheGame[index]) {
        outcome = LETTER_RESULTS.SUCCESS;
      } else if (lettersOfWordOfTheGame.includes(guessedLetter)) {
        outcome = LETTER_RESULTS.MISPLACED;
      }

      result.push(outcome);
      if (
        updateGuessedLetterResults[guessedLetter] !== LETTER_RESULTS.SUCCESS
      ) {
        updateGuessedLetterResults = {
          ...updateGuessedLetterResults,
          [guessedLetter]: outcome,
        };
      }
    });

    setGuessedLetterResults(updateGuessedLetterResults);

    return result;
  }

  return (
    <div>
      {wordOfTheGame}
      {wordOfTheGame ? (
        <>
          <div className="messages-container">
            <label>{warning}</label>
          </div>
          <Board data={data} warning={warning} word={wordOfTheGame} />
          {gameRunning ? (
            <Keyboard
              guessedLetterResults={guessedLetterResults}
              onClickKey={(key: string) => handleClickKey(key)}
            />
          ) : (
            <div className="messages-container animation-bounce">
              <button
                onClick={resetGame}
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Start Again?
              </button>
            </div>
          )}
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
