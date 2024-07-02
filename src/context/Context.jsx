import { createContext, useState } from "react";
import runChat from "../config/gemini";
import { fetchSummary } from "../config/article"; // Import the summarizer service
import { spellcheck } from "../config/spellcheck"; // Import the spellchecker service
import { formatResponseText } from "../utils/formatResponseText"; // Import the utility function

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput(""); // Reset the input
    setRecentPrompt(""); // Reset the recentPrompt
  };

  const onSent = async (prompt, isSummarizer, isSpellchecker) => {
    setInput(""); // Clear input before generating response
    setResultData("");
    setLoading(true);
    setShowResult(true);

    // Add the prompt to recent history if it's not already present
    if (prompt && !prevPrompts.includes(prompt)) {
      setPrevPrompts((prev) => [...prev, prompt]);
    }

    if (isSummarizer && isValidUrl(prompt)) {
      // If input is a URL and summarizer is selected, use the summarizer API
      setRecentPrompt(prompt); // Update recentPrompt immediately
      try {
        const summary = await fetchSummary(prompt);
        const formattedSummary = formatResponseText(summary); // Use the utility function to format the summary
        setResultData(formattedSummary);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setResultData("Failed to fetch summary.");
        setLoading(false);
      }
    } else if (isSpellchecker) {
      // If input is a text prompt and spellchecker is selected, use the spellchecker API
      setRecentPrompt(prompt); // Update recentPrompt immediately
      try {
        const correctedText = await spellcheck({
          body: JSON.stringify({ textToCheck: prompt }),
        });
        const formattedResponse = formatResponseText(correctedText); // Use the utility function to format the corrected text
        setResultData(formattedResponse);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setResultData("Failed to check spelling.");
        setLoading(false);
      }
    } else {
      // If input is a text prompt or summarizer is not selected, use the chat API
      let response;
      if (prompt !== undefined) {
        setRecentPrompt(prompt); // Update recentPrompt immediately
        response = await runChat(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await runChat(input);
      }

      const formattedResponse = formatResponseText(response); // Use the utility function to format the response

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
