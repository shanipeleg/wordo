import { useEffect, useState } from "react";
import { KEYPRESS_TO_KEYS, KEYS, alphabet } from "../consts";

export default function useKeyPress(triggerFunction: Function, data: any) {
  const [keyPressed, setKeyPressed] = useState("");

  const upHandler = ({ key }: KeyboardEvent) => {
    const uppercase = key.toUpperCase();
    if (alphabet.includes(uppercase)) {
      setKeyPressed(uppercase);
      triggerFunction(uppercase);
    }
    if (KEYPRESS_TO_KEYS.hasOwnProperty(uppercase)) {
      setKeyPressed(KEYPRESS_TO_KEYS[uppercase]);
      triggerFunction(KEYPRESS_TO_KEYS[uppercase]);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  }, [data]);

  return keyPressed;
}
