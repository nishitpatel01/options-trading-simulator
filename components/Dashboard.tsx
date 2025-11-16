
import React from 'react';
import { StockChart } from './StockChart';
import { TradePanel } from './TradePanel';
import { Portfolio } from './Portfolio';
import type { StockDataPoint, OptionPosition, TradeParams } from '../types';

interface DashboardProps {
  cash: number;
  stockData: StockDataPoint[];
  currentDay: number;
  positions: OptionPosition[];
  onPlaceTrade: (trade: TradeParams) => boolean;
  onNextDay: () => void;
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cash,
  stockData,
  currentDay,
  positions,
  onPlaceTrade,
  onNextDay,
  isLoading
}) => {
  const currentPrice = stockData[currentDay]?.price ?? 0;
  const priceChange = currentDay > 0 ? currentPrice - stockData[currentDay - 1].price : 0;
  const priceChangePercent = currentDay > 0 && stockData[currentDay - 1].price > 0 ? (priceChange / stockData[currentDay - 1].price) * 100 : 0;
  const isPositiveChange = priceChange >= 0;

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/60 p-4 rounded-xl shadow-2xl border border-gray-700">
           <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white">APEX Inc. (APEX)</h2>
                <div className="flex items-baseline space-x-2">
                    <p className={`text-4xl font-mono ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>${currentPrice.toFixed(2)}</p>
                    <p className={`text-xl font-mono ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                    </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg text-gray-400">Day: <span className="font-bold text-white">{currentDay}</span></p>
              </div>
           </div>
          <StockChart data={stockData.slice(0, currentDay + 1)} />
        </div>
        <div className="bg-gray-800/60 p-4 rounded-xl shadow-2xl border border-gray-700">
          <TradePanel currentPrice={currentPrice} onPlaceTrade={onPlaceTrade} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/60 p-4 rounded-xl shadow-2xl border border-gray-700">
           <Portfolio positions={positions} />
        </div>
        <div className="flex flex-col justify-end bg-gray-800/60 p-4 rounded-xl shadow-2xl border border-gray-700">
          <div className="text-center">
             <p className="text-lg text-gray-300 mb-1">Total Portfolio Value</p>
             <p className="text-4xl font-bold mb-4">${(cash + positions.reduce((acc, p) => acc + p.currentValue, 0)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
             <button
              onClick={onNextDay}
              disabled={isLoading}
              className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Simulate Next Day"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
