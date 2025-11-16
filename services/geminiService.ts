
import { GoogleGenAI } from "@google/genai";
import type { OptionPosition } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY is not set. Using a placeholder. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

export async function getTradeAnalysis(position: OptionPosition, finalStockPrice: number, finalDay: number): Promise<string> {
  const pnl = position.pnl;
  const prompt = `
You are an expert options trading coach called 'Apex Mentor'. Your goal is to explain the outcome of a simulated options trade to a user who is new to options but understands the stock market. Be encouraging and focus on the learning opportunity.

Analyze the following trade:

**Trade Details:**
- Stock: APEX Inc.
- Strategy: Buying a ${position.type} Option
- Strike Price: $${position.strikePrice.toFixed(2)}
- Expiration: ${position.expirationDay - position.purchaseDay} days from purchase
- Premium Paid (per share): $${(position.costBasis / (100 * position.contracts)).toFixed(2)}
- Total Cost: $${position.costBasis.toFixed(2)}
- Initial Stock Price: $${position.initialStockPrice.toFixed(2)}

**Trade Outcome:**
- The option expired on Day ${finalDay}.
- Final Stock Price: $${finalStockPrice.toFixed(2)}
- Profit/Loss: $${pnl.toFixed(2)} (${pnl >= 0 ? 'Profit' : 'Loss'})

**Your Analysis (in Markdown):**

1.  **## Trade Breakdown:**
    *   Explain what buying a ${position.type} option means in simple terms.
    *   Was the option In-the-Money, At-the-Money, or Out-of-the-Money at expiration? Explain why.
    *   Calculate and explain the breakeven price for this trade.

2.  **## What Went ${pnl >= 0 ? 'Right' : 'Wrong'}?**
    *   Analyze the stock's price movement relative to the strike price.
    *   Explain how the final stock price determined the profit or loss.
    *   Mention the role of 'Time Decay' (Theta). Explain that the option loses value every day, and why this was a factor in the outcome.

3.  **## Key Takeaway & Learning:**
    *   Provide one key, actionable takeaway from this trade.
    *   If it was a loss, suggest what could have been done differently (e.g., choosing a different strike price, a longer expiration date, or if this was the right strategy for the expected market move).
    *   If it was a profit, explain what made the decision a good one and what risks were still present.

Keep the tone positive and educational. Use bullet points and bold text to make it easy to read. Do not wrap your response in markdown backticks.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Could not retrieve analysis at this time. Please check your API key and network connection.";
  }
}
