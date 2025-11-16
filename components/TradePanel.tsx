
import React, { useState, useMemo } from 'react';
import { OptionType, TradeParams } from '../types';
import { calculateOptionPremium } from '../services/marketSimService';
import { InfoIcon } from './icons/InfoIcon';

interface TradePanelProps {
  currentPrice: number;
  onPlaceTrade: (trade: TradeParams) => boolean;
}

const expirations = [5, 10, 20, 30, 60];

export const TradePanel: React.FC<TradePanelProps> = ({ currentPrice, onPlaceTrade }) => {
  const [optionType, setOptionType] = useState<OptionType>(OptionType.Call);
  const [strikePrice, setStrikePrice] = useState<number>(0);
  const [expirationDays, setExpirationDays] = useState<number>(expirations[2]);
  const [contracts, setContracts] = useState<number>(1);
  const [isFocused, setIsFocused] = useState(false);

  React.useEffect(() => {
      setStrikePrice(Math.round(currentPrice / 5) * 5);
  }, [currentPrice]);
  
  const strikePrices = useMemo(() => {
    const base = Math.round(currentPrice / 5) * 5;
    const prices = new Set<number>();
    for (let i = -5; i <= 5; i++) {
        prices.add(Math.max(5, base + i * 5));
    }
    return Array.from(prices).sort((a,b) => a-b);
  }, [currentPrice]);

  const premium = useMemo(() => {
    if (strikePrice > 0) {
      return calculateOptionPremium(currentPrice, strikePrice, expirationDays, 0.2, optionType);
    }
    return 0;
  }, [currentPrice, strikePrice, expirationDays, optionType]);

  const totalCost = premium * 100 * contracts;
  const breakEven = optionType === OptionType.Call ? strikePrice + premium : strikePrice - premium;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradePlaced = onPlaceTrade({
      type: optionType,
      strikePrice,
      expirationDays,
      contracts,
    });
    if (tradePlaced) {
      setContracts(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-white mb-2">New Trade</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setOptionType(OptionType.Call)}
          className={`py-3 rounded-md font-semibold transition-all ${optionType === OptionType.Call ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          BUY CALL
        </button>
        <button
          type="button"
          onClick={() => setOptionType(OptionType.Put)}
          className={`py-3 rounded-md font-semibold transition-all ${optionType === OptionType.Put ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          BUY PUT
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Strike Price</label>
        <select value={strikePrice} onChange={e => setStrikePrice(Number(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
          {strikePrices.map(p => <option key={p} value={p}>${p.toFixed(2)}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Expiration</label>
        <div className="grid grid-cols-5 gap-2">
          {expirations.map(day => (
            <button
              type="button"
              key={day}
              onClick={() => setExpirationDays(day)}
              className={`p-2 text-sm rounded-md transition-all ${expirationDays === day ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {day}d
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Contracts</label>
        <div className="relative">
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={contracts} 
            onChange={e => setContracts(Number(e.target.value))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
           <div 
             className={`absolute bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-md -top-8 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
             style={{ left: `calc(${(contracts-1)*100/9}% - 16px)`}}
           >
             {contracts}
           </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-3 rounded-lg space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400 flex items-center">Premium <InfoIcon tooltip="Price per share for the option contract." /></span>
          <span className="font-mono text-white">${premium.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 flex items-center">Total Cost <InfoIcon tooltip="Premium x 100 shares/contract x Number of Contracts." /></span>
          <span className="font-mono text-white">${totalCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 flex items-center">Break-even <InfoIcon tooltip="Stock price at expiration for you to not lose money." /></span>
          <span className="font-mono text-white">${breakEven.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex-grow"></div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
      >
        Place Trade
      </button>
    </form>
  );
};
