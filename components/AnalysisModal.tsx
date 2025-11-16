
import React from 'react';
import type { OptionPosition } from '../types';

// A simple markdown parser
const Markdown: React.FC<{ text: string }> = ({ text }) => {
    const html = text
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-cyan-400 mt-4 mb-2">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/\n/g, '<br />');

    return <div className="prose-invert" dangerouslySetInnerHTML={{ __html: html }} />;
};


interface AnalysisModalProps {
  result: {
    position: OptionPosition;
    analysis: string;
  };
  onClose: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ result, onClose }) => {
  const { position, analysis } = result;
  const isProfit = position.pnl >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700 animate-fade-in">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">Trade Result</h2>
              <p className={`text-4xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                {isProfit ? '+' : ''}${position.pnl.toFixed(2)}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="bg-gray-900/50 p-4 rounded-lg mb-4 text-sm">
                <h3 className="font-bold text-gray-300 mb-2">Trade Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                    <p><span className="text-gray-400">Type:</span> {position.type.toUpperCase()}</p>
                    <p><span className="text-gray-400">Strike:</span> ${position.strikePrice.toFixed(2)}</p>
                    <p><span className="text-gray-400">Expired on Day:</span> {position.expirationDay}</p>
                    <p><span className="text-gray-400">Cost:</span> ${position.costBasis.toFixed(2)}</p>
                </div>
            </div>
            
            <div className="text-gray-300 leading-relaxed">
                <Markdown text={analysis} />
            </div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-b-xl text-right">
            <button onClick={onClose} className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-600 transition-all duration-300">
              Continue
            </button>
        </div>
      </div>
    </div>
  );
};
