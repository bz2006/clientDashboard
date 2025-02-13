import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "./loader.json"; 
import reportloadingAnimation from "./reports-loader.json";// Ensure you have a Lottie JSON file

const LoadingOverlay = ({report, isLoading,message }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <Lottie animationData={report===true?reportloadingAnimation:loadingAnimation} loop={true} className="w-56 h-56" />
        <p className=" text-lg font-semibold text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
