import { gameDataRow } from "./components/wordle/wordle";

export enum KEYS {
  ENTER = "ENTER",
  DEL = "DEL",
  BACKSPACE = "BACKSPACE",
  SKIP = "ARROWRIGHT",
}

export enum LETTER_RESULTS {
  "SUCCESS" = "letter-success",
  "MISPLACED" = "letter-misplaced",
  "WRONG" = "letter-wrong",
}

export const KEYPRESS_TO_KEYS: { [key: string]: KEYS } = {
  BACKSPACE: KEYS.DEL,
  ENTER: KEYS.ENTER,
  ARROWRIGHT: KEYS.SKIP,
};

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const freshGameState: gameDataRow[] = [
  {
    inFocus: true,
    guesses: ["", "", "", "", ""],
    number: 1,
    guessed: false,
    results: [],
  },
  {
    inFocus: false,
    guesses: ["", "", "", "", ""],
    number: 2,
    guessed: false,
    results: [],
  },
  {
    inFocus: false,
    guesses: ["", "", "", "", ""],
    number: 3,
    guessed: false,
    results: [],
  },
  {
    inFocus: false,
    guesses: ["", "", "", "", ""],
    number: 4,
    guessed: false,
    results: [],
  },
  {
    inFocus: false,
    guesses: ["", "", "", "", ""],
    number: 5,
    guessed: false,
    results: [],
  },
  {
    inFocus: false,
    guesses: ["", "", "", "", ""],
    number: 6,
    guessed: false,
    results: [],
  },
];
