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
