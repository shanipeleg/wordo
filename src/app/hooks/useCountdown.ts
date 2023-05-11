import { useEffect, useState } from "react";

export default function useCountdown(
  duration: number,
  onTimerEnd: Function,
  dependencies: any[] = []
) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (isActive && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    if (secondsLeft <= 0) {
      setIsActive(false);
      onTimerEnd();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, secondsLeft, onTimerEnd]);

  const startTimer = () => {
    setIsActive(true);
    setSecondsLeft(duration);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(duration);
  };

  return {
    secondsLeft,
    startTimer,
    resetTimer,
  };
}
