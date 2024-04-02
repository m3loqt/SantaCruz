import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";

function Faq() {
  const [typedText, setTypedText] = useState("");
  const headerText = "FAQ Page"; // Replace with your desired header text

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typedText.length < headerText.length) {
        setTypedText(typedText + headerText[typedText.length]);
      } else {
        clearInterval(intervalId);
      }
    }, 100); // Adjust speed here (lower for faster typing)

    return () => clearInterval(intervalId);
  }, [typedText, headerText]);

  return (
    <div className="ml-44 ">
      <Sidebar></Sidebar>
      <h1 className="text-8xl font-bold ml-16 mb-4 mt-72 text-center text-zinc-700 typewriter-text">
        {typedText}
      </h1>
    </div>
  );
}

export default Faq;