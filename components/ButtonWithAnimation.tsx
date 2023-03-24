import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/solid";

interface Props {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

const ButtonWithAnimation = ({ text, onClick }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    await onClick();
    setIsProcessing(false);
    setIsFinished(true);
    setTimeout(() => {
      setIsFinished(false);
    }, 5000);
  };

  return (
    <button
      className=" bg-blue-500 text-white px-4 py-2 rounded-full transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 "
      onClick={handleClick}
    >
      {isProcessing && !isFinished && (
        <svg
          className="animate-spin h-5 w-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16v3a5 5 0 010 10v3a8 8 0 008 8h4a8.001 8.001 0 01-12.657 6.343l-1.414-1.414A5.965 5.965 0 0112 18v-6z"
          />
        </svg>
      )}
      <div className="flex items-center">
        {isFinished && (
          <CheckCircleIcon className="h-5 w-5 mr-3 text-green-500" />
        )}
        <div className="flex flex-row items-center">
          {isFinished ? "Processing..." : text}
        </div>
      </div>
    </button>
  );
};

export default ButtonWithAnimation;
