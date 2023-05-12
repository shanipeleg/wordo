import getRandomWord from "@/app/utils/getRandomWord";
import words from "../../words_hints.json";
import { useEffect, useRef, useState } from "react";
import Keyboard from "../shared/keyboard";
import { KEYS } from "@/app/consts";
import useKeyPress from "@/app/hooks/useKeyPress";
import useCountdown from "@/app/hooks/useCountdown";
import generateUniqueRandomNumbers from "@/app/utils/generateUniqueRandomNumbers";
import useToast from "@/app/hooks/useToast";
import React, { KeyboardEvent } from "react";

import Stats from "./stats";
import skip from "../../../../public/skip.svg";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface gameDataInterface {
  currentWordIndex: number;
  wordsGuessed: number;
  wordsSkipped: number;
  gameStarted: boolean;
}

export default function Wordo() {
  interface wordMap {
    word: string[];
    guessable: (string | null)[];
    indexes: number[];
    hint: string;
  }

  const [gameData, setGameData] = useState<gameDataInterface>({
    currentWordIndex: 0,
    wordsGuessed: 0,
    wordsSkipped: 0,
    gameStarted: false,
  });

  const timeToAnswer = 60;
  const [gameRecord, setGameRecord] = useState<gameDataInterface[]>([]);

  const [wordMap, setWordMap] = useState<wordMap[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const { secondsLeft, startTimer, resetTimer } = useCountdown(
    timeToAnswer,
    stopGame,
    [gameRunning]
  );
  const [lettersToGuess, setLettersToGuess] = useState(2);
  const [wordState, setWordState] = useState("");

  function findNextWord(allWords: string[], wordOfTheGameSplit: string[]) {
    const wordGames: { [key: string]: string } = words;

    let indexes = generateUniqueRandomNumbers(
      0,
      wordOfTheGameSplit.length - 1,
      lettersToGuess
    );

    const nextWordString =
      allWords[Math.floor(Math.random() * allWords.length)];
    const nextWordArray = nextWordString.split("");
    let makeGuessable: (string | null)[] = [];
    nextWordArray.forEach((letter, index) => {
      let toPush = indexes.includes(index) ? null : letter;
      makeGuessable.push(toPush);
    });

    return {
      word: nextWordArray,
      guessable: makeGuessable,
      indexes,
      hint: wordGames[nextWordString],
    };
  }

  function buildWordMap() {
    let wordsAsArray = Object.keys(words);
    const wordOfTheGame = getRandomWord(wordsAsArray);
    const wordOfTheGameSplit = wordOfTheGame.split("");
    let nextWord = findNextWord(wordsAsArray, wordOfTheGameSplit);
    let count = 0;
    const data = [];
    while (nextWord && count <= 100) {
      nextWord = findNextWord(wordsAsArray, nextWord.word);
      if (nextWord) {
        let nextWordJoined = nextWord.word.join("");
        data.push(nextWord);
        wordsAsArray = wordsAsArray.filter((word) => word !== nextWordJoined);
        count++;
      }
    }
    return data;
  }

  const { showToast, showToastMessage, toastMessage } = useToast();

  function startGame() {
    const map = buildWordMap();
    setWordMap(map);
    setGameRunning(true);
    startTimer();
    resetGameData();
  }

  function resetGameData() {
    setWordState("");
    setGameData({
      currentWordIndex: 0,
      wordsGuessed: 0,
      wordsSkipped: 0,
      gameStarted: false,
    });
  }

  function saveRecord(wordsGuessed: number, wordsSkipped: number) {
    fetch("/api/saveRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wordsGuessed, wordsSkipped }),
    })
      .then((res) => res.json())
      .then(({ data }) => console.log(data));
  }

  function stopGame() {
    setGameRunning(false);
  }
  useEffect(() => {
    if (!gameRunning) {
      if (gameData.gameStarted) {
        saveRecord(gameData.wordsGuessed, gameData.wordsSkipped);
      }
      resetGameData();
    }
  }, [gameRunning]);

  useKeyPress((keyPressed: string) => {
    handleClickKey(keyPressed);
  }, {});

  function handleEnter() {
    const word = wordMap[gameData.currentWordIndex];
    const missingLetters = word.guessable.filter((letter) => !letter);
    if (missingLetters.length) {
      setWordState("warning-animation");
      return;
    }
    if (word.word.join("") === word.guessable.join("")) {
      showToastMessage(`You got it!`);
      setWordState("dance-animation");
      setGameData((prevGameData) => ({
        ...prevGameData,
        gameStarted: true,
        wordsGuessed: prevGameData.wordsGuessed + 1,
        currentWordIndex: prevGameData.currentWordIndex + 1,
      }));
    } else {
      setWordState("warning-animation");
    }
  }

  function handleClickKey(key: string) {
    setWordState("");
    if (key === KEYS.ENTER) {
      handleEnter();
      return;
    }

    if (key === KEYS.SKIP) {
      skipWord();
      return;
    }

    let mapCopy = { ...wordMap };
    const wordCopy = { ...mapCopy[gameData.currentWordIndex] };
    if (key === KEYS.DEL) {
      let indexToDelete = -1;
      for (let i = 0; i <= wordCopy.guessable.length - 1; i++) {
        if (wordCopy.indexes.includes(i) && wordCopy.guessable[i]) {
          indexToDelete = i;
        }
      }

      wordCopy.guessable[indexToDelete] = null;
      mapCopy = { ...mapCopy, [gameData.currentWordIndex]: wordCopy };
      setWordMap(mapCopy);
      return;
    }

    const indexOfMissingLetter = wordCopy.guessable.findIndex(
      (letter: string | null) => !letter
    );
    if (indexOfMissingLetter !== -1) {
      wordCopy.guessable[indexOfMissingLetter] = key;
      mapCopy = { ...mapCopy, [gameData.currentWordIndex]: wordCopy };
      setWordMap(mapCopy);
    }
  }

  function skipWord() {
    showToastMessage(
      `The word was ${wordMap[gameData.currentWordIndex].word.join("")}!`
    );
    setGameData((prevGameData) => ({
      ...prevGameData,
      currentWordIndex: prevGameData.currentWordIndex + 1,
      wordsSkipped: prevGameData.wordsSkipped + 1,
      gameStarted: true,
    }));
  }

  function renderGame() {
    let word = wordMap[gameData.currentWordIndex];
    if (!word) return;
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
  return (
    <div className="flex justify-center items-center min-h-screen">
      {gameRunning ? (
        <>
          {wordMap && gameData ? (
            <div>
              {renderGame()}
              <Keyboard
                onClickKey={(key: string) => handleClickKey(key)}
                guessedLetterResults={{}}
                includeSkip={true}
              />
              {toastMessage && (
                <div className="toast">
                  <div
                    id="toast-top-right"
                    className="fixed flex justify-end w-full max-w-xs p-4 space-x-4 text-gray-100 bg-none divide-x divide-gray-200 top-5 right-5 d-400 y-700 space-x transition-opacity ease-in duration-1000 opacity-100 hover:opacity-0"
                    role="alert"
                  >
                    <div className="text-sm font-normal">{toastMessage}</div>
                  </div>
                </div>
              )}
              <button
                onClick={stopGame}
                className="text-white bg-gradient-to-br from-red-400 to-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Stop Game
              </button>
            </div>
          ) : (
            "Loading..."
          )}
        </>
      ) : (
        <div className="grid place-items-center starting-div text-center">
          <div className="mb-3">
            {!gameRecord.length ? (
              <div className="mx-2 xs:w-[15em]">
                You have {timeToAnswer} seconds to guess as many words as you
                can!
              </div>
            ) : (
              <div>Great game!</div>
            )}
          </div>

          <Stats />
          <button
            onClick={() => startGame()}
            className="text-white mt-3 animation-bounce bg-gradient-to-br from-green-400 to-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
