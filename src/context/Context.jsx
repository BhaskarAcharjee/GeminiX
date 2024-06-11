import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
        response = await runChat(prompt);
        setRecentPrompt(prompt);
    } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await runChat(input);
    }

    let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold text enclosed in **
    formattedResponse = formattedResponse.replace(/\*(.*?)\*/g, '- $1'); // Bullet points for text enclosed in *
    formattedResponse = formattedResponse.replace(/(\r\n|\n|\r)/gm, '<br>'); // Replace line breaks with <br>

    setResultData(formattedResponse);
    setLoading(false);
    setInput("");
};


  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
