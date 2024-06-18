// Import the OpenAI package
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function spellcheck({ body }) {
  const { textToCheck } = JSON.parse(body);

  // Create a new instance of OpenAI.
  const openai = new OpenAI({ apiKey : OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  const userPrompt =
    "Correct the spelling and grammatical errors in the following text:\n\n";

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a copy editor that corrects pieces of text, you always reply with just the corrected text, no explanations or other description",
      },
      {
        role: "user",
        content: userPrompt + textToCheck,
      },
    ],
  });

  // The message.content will contain the corrected text...
  const correctedText = gptResponse.choices[0].message.content;

  return {
    statusCode: 200,
    body: correctedText,
  };
}
