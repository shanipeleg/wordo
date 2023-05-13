import generateUniqueRandomNumbers from "./generateUniqueRandomNumbers";
import getRandomWord from "./getRandomWord";
import words from "@/app/words_hints.json";

function findNextWord(
  allWords: string[],
  wordOfTheGameSplit: string[],
  lettersToGuess: number
) {
  const wordGames: { [key: string]: string } = words;

  let indexes = generateUniqueRandomNumbers(
    0,
    wordOfTheGameSplit.length - 1,
    lettersToGuess
  );

  const nextWordString = allWords[Math.floor(Math.random() * allWords.length)];
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

export default function buildWordMap(lettersToGuess: number) {
  let wordsAsArray = Object.keys(words);
  const wordOfTheGame = getRandomWord(wordsAsArray);
  const wordOfTheGameSplit = wordOfTheGame.split("");
  let nextWord = findNextWord(wordsAsArray, wordOfTheGameSplit, lettersToGuess);
  let count = 0;
  const data = [];
  while (nextWord && count <= 100) {
    nextWord = findNextWord(wordsAsArray, nextWord.word, lettersToGuess);
    if (nextWord) {
      let nextWordJoined = nextWord.word.join("");
      data.push(nextWord);
      wordsAsArray = wordsAsArray.filter((word) => word !== nextWordJoined);
      count++;
    }
  }
  return data;
}
