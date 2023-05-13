import { useEffect, useState } from "react";
import Keyboard from "@/app/components/shared/keyboard";
import { KEYS } from "@/app/consts";
import useKeyPress from "@/app/hooks/useKeyPress";
import useCountdown from "@/app/hooks/useCountdown";
import useToast from "@/app/hooks/useToast";
import buildWordMap from "@/app/utils/buildWordMap";
import { saveRecord } from "@/app/services/recordAPI";
import React from "react";
import successMessages from "../../successMessages.json";

import Stats from "./stats";
import Game from "./game";

export interface gameDataInterface {
  currentWordIndex: number;
  wordsGuessed: number;
  wordsSkipped: number;
  gameStarted: boolean;
}

export interface wordMap {
  word: string[];
  guessable: (string | null)[];
  indexes: number[];
  hint: string;
}

export default function Wordo() {
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
  const { secondsLeft, startTimer } = useCountdown(timeToAnswer, stopGame);
  const [lettersToGuess, setLettersToGuess] = useState(2);
  const [wordState, setWordState] = useState("");

  const { showToastMessage, toastMessage } = useToast();

  function startGame() {
    const map = buildWordMap(lettersToGuess);
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
      const successMessage =
        successMessages[Math.floor(Math.random() * successMessages.length)];
      showToastMessage(successMessage);
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
    if (!word) return null;
    return <Game secondsLeft={secondsLeft} wordState={wordState} word={word} />;
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
