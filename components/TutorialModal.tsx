
import React, { useState } from 'react';

const tutorialSteps = [
  {
    title: "Welcome to Apex Trader!",
    content: "This is a risk-free game to help you learn options trading. You'll start with $10,000 in virtual cash. Your goal is to grow your portfolio by making smart trades. Let's walk through the basics."
  },
  {
    title: "Understanding the Chart",
    content: "The main chart shows the price history of APEX Inc. stock. You can see the current price, the day's change, and the overall trend. Use this to predict where the price might go next."
  },
  {
    title: "What is an Option?",
    content: "An option is a contract that gives you the right, but not the obligation, to buy or sell a stock at a specific price (the strike price) by a certain date (the expiration date). There are two basic types: Calls and Puts."
  },
  {
    title: "CALL Options (Betting on a Rise)",
    content: "You buy a **CALL** option when you believe the stock price will **RISE** above the strike price before it expires. If you're right, your option becomes more valuable."
  },
  {
    title: "PUT Options (Betting on a Fall)",
    content: "You buy a **PUT** option when you believe the stock price will **FALL** below the strike price before it expires. If the stock drops as you predicted, your option increases in value."
  },
  {
    title: "The Trade Panel",
    content: "Here's where you'll build your trades. You can select a CALL or PUT, choose a **Strike Price** (your target price), and an **Expiration** (how long you have). The **Premium** is the cost of the option contract."
  },
  {
    title: "Your Portfolio",
    content: "After placing a trade, your option position will appear in the 'Open Positions' table. You can track its current value and your Profit or Loss (P/L) each day."
  },
  {
    title: "Simulating Time",
    content: "The market moves one day at a time. Click the **'Simulate Next Day'** button to advance time and see how the stock price changes and affects the value of your options."
  },
  {
    title: "Learning from Trades",
    content: "When an option expires, our AI 'Apex Mentor' will give you a detailed analysis of the trade. It will explain what went right or wrong and provide key takeaways to help you improve. Good luck, trader!"
  }
];


interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const currentStep = tutorialSteps[step];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 animate-fade-in">
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-cyan-400">{currentStep.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6 text-gray-300 leading-relaxed min-h-[150px]">
          <p dangerouslySetInnerHTML={{ __html: currentStep.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>') }} />
        </div>
        <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Step {step + 1} of {tutorialSteps.length}
          </div>
          <div className="space-x-2">
            <button 
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {step < tutorialSteps.length - 1 ? (
                <button 
                    onClick={() => setStep(s => s + 1)}
                    className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-all"
                >
                Next
                </button>
            ) : (
                <button onClick={onClose} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-all">
                Finish
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
