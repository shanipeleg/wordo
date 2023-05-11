import React, { useState, useEffect } from "react";

const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage("");
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showToast, toastMessage]);

  const showToastMessage = (message: string) => {
    setShowToast(true);
    setToastMessage(message);
  };

  return {
    showToast,
    showToastMessage,
    toastMessage,
  };
};

export default useToast;
