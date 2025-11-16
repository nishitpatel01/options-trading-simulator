
import React, { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { AnalysisModal } from './components/AnalysisModal';
import { ScenarioSelector } from './components/ScenarioSelector';
import { TutorialModal } from './components/TutorialModal';
import { generateInitialStockData, calculateOptionPremium } from './services/marketSimService';
import { getTradeAnalysis } from './services/geminiService';
import { OptionPosition, StockDataPoint, TradeParams, OptionType, MarketScenario } from './types';
import { INITIAL_CASH, STOCK_TICKER, SIMULATION_DAYS } from './constants';
import { QuestionIcon } from './components/icons/QuestionIcon';

const App: React.FC = () => {
  const [cash, setCash] = useState<number>(INITIAL_CASH);
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [positions, setPositions] = useState<OptionPosition[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{ position: OptionPosition; analysis: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);
  const [marketScenario, setMarketScenario] = useState<MarketScenario>(MarketScenario.Classic);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const showMessage = (msg: string) => {
    setGameMessage(msg);
    setTimeout(() => setGameMessage(null), 3000);
  };
  
  const startGame = useCallback((scenario: MarketScenario) => {
    setMarketScenario(scenario);
    setCash(INITIAL_CASH);
    const initialData = generateInitialStockData(SIMULATION_DAYS, scenario);
    setStockData(initialData);
    setCurrentDay(0);
    setPositions([]);
    setAnalysisResult(null);
    showMessage(`New simulation started: ${scenario} market.`);
  }, []);

  useEffect(() => {
    startGame(MarketScenario.Classic);
  }, [startGame]);

  const handleScenarioChange = (scenario: MarketScenario) => {
    startGame(scenario);
  };

  const handlePlaceTrade = (trade: TradeParams): boolean => {
    const currentStockPrice = stockData[currentDay]?.price;
    if (!currentStockPrice) return false;

    const premium = calculateOptionPremium(
      currentStockPrice,
      trade.strikePrice,
      trade.expirationDays,
      0.2, // volatility
      trade.type
    );
    
    const totalCost = premium * 100 * trade.contracts;

    if (cash < totalCost) {
      showMessage("Not enough cash to place trade.");
      return false;
    }

    const newPosition: OptionPosition = {
      id: Date.now(),
      type: trade.type,
      strikePrice: trade.strikePrice,
      expirationDay: currentDay + trade.expirationDays,
      purchaseDay: currentDay,
      contracts: trade.contracts,
      costBasis: totalCost,
      initialStockPrice: currentStockPrice,
      currentValue: totalCost, 
      pnl: 0
    };

    setPositions(prev => [...prev, newPosition]);
    setCash(prev => prev - totalCost);
    showMessage(`Trade placed: ${trade.contracts} ${STOCK_TICKER} ${trade.strikePrice} ${trade.type.toUpperCase()}`);
    return true;
  };
  
  const handleNextDay = useCallback(async () => {
    if (currentDay >= SIMULATION_DAYS - 1) {
      showMessage("End of simulation.");
      return;
    }
    
    setIsLoading(true);

    const newDay = currentDay + 1;
    const nextPrice = stockData[newDay]?.price;
  
    setCurrentDay(newDay);

    const updatedPositions: OptionPosition[] = [];
    const expiredPositions: OptionPosition[] = [];

    positions.forEach(pos => {
      if (newDay >= pos.expirationDay) {
        expiredPositions.push(pos);
      } else {
        const daysToExpiration = pos.expirationDay - newDay;
        const currentPremium = calculateOptionPremium(nextPrice, pos.strikePrice, daysToExpiration, 0.2, pos.type);
        const currentValue = currentPremium * 100 * pos.contracts;
        updatedPositions.push({ ...pos, currentValue, pnl: currentValue - pos.costBasis });
      }
    });

    setPositions(updatedPositions);

    for (const pos of expiredPositions) {
      let pnl = -pos.costBasis;
      if (pos.type === OptionType.Call && nextPrice > pos.strikePrice) {
        pnl = (nextPrice - pos.strikePrice) * 100 * pos.contracts - pos.costBasis;
      } else if (pos.type === OptionType.Put && nextPrice < pos.strikePrice) {
        pnl = (pos.strikePrice - nextPrice) * 100 * pos.contracts - pos.costBasis;
      }
      
      const finalPosition = { ...pos, pnl, currentValue: Math.max(0, pos.costBasis + pnl) };
      setCash(prev => prev + finalPosition.currentValue);
      
      try {
        const analysis = await getTradeAnalysis(finalPosition, nextPrice, newDay);
        setAnalysisResult({ position: finalPosition, analysis });
      } catch (error) {
        console.error("Failed to get trade analysis:", error);
        const fallbackAnalysis = `Trade analysis failed. Your P/L was $${pnl.toFixed(2)}.`;
        setAnalysisResult({ position: finalPosition, analysis: fallbackAnalysis });
      }
    }

    setIsLoading(false);
  }, [currentDay, stockData, positions]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg sticky top-0 z-20">
         <div className="flex justify-between items-center max-w-screen-xl mx-auto">
            <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-wider">
                    <span className="text-white">Apex</span> Trader
                </h1>
                <p className="text-sm text-gray-400 hidden sm:block">The Ultimate Options Trading Simulator</p>
            </div>
            <button 
                onClick={() => setShowTutorial(true)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label="Open tutorial"
            >
                <QuestionIcon />
                <span className="hidden md:inline">Tutorial</span>
            </button>
        </div>
      </header>

      <main className="p-4 md:p-6 lg:p-8 max-w-screen-xl mx-auto">
        <ScenarioSelector currentScenario={marketScenario} onSelectScenario={handleScenarioChange} />
        <Dashboard
          cash={cash}
          stockData={stockData}
          currentDay={currentDay}
          positions={positions}
          onPlaceTrade={handlePlaceTrade}
          onNextDay={handleNextDay}
          isLoading={isLoading}
        />
      </main>
      
      {gameMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-700 text-white py-2 px-4 rounded-lg shadow-xl animate-fade-in-out">
          {gameMessage}
        </div>
      )}

      {analysisResult && (
        <AnalysisModal
          result={analysisResult}
          onClose={() => setAnalysisResult(null)}
        />
      )}
      
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default App;
