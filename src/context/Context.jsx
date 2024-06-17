import { createContext, useState } from "react";
import runChat from "../config/gemini";
import { fetchSummary } from "../services/article"; // Import the summarizer service

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
    setInput(""); // Clear input before generating response
    setResultData("");
    setLoading(true);
    setShowResult(true);

    if (isValidUrl(input)) {
      // If input is a URL, use the summarizer API
      try {
        const summary = await fetchSummary(input);
        setResultData(summary);
        setLoading(false);
        setRecentPrompt(input);
      } catch (error) {
        console.error(error);
        setResultData("Failed to fetch summary.");
        setLoading(false);
      }
    } else {
      // If input is a text prompt, use the chat API
      let response;
      if (prompt !== undefined) {
        response = await runChat(prompt);
        setRecentPrompt(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await runChat(input);
      }

      let formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold text enclosed in **
        .replace(/\* \*\*(.*?):\*\*/g, "» <b>$1:</b>") // Bullet points and bold for * **text:**
        .replace(/\* (.*?)/g, "• $1"); // Bullet points for * text

      formattedResponse = formattedResponse.replace(/(\r\n|\n|\r)/gm, "<br>"); // Replace line breaks with <br>

      setResultData(formattedResponse);
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
