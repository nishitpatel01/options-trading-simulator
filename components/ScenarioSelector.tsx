
import React from 'react';
import { MarketScenario } from '../types';

interface ScenarioSelectorProps {
  currentScenario: MarketScenario;
  onSelectScenario: (scenario: MarketScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ currentScenario, onSelectScenario }) => {
  const scenarios = Object.values(MarketScenario);

  return (
    <div className="bg-gray-800/60 p-3 rounded-xl shadow-lg border border-gray-700">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm font-semibold text-gray-300 mr-2">Market Scenario:</span>
        {scenarios.map(scenario => (
          <button
            key={scenario}
            onClick={() => onSelectScenario(scenario)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              currentScenario === scenario
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {scenario}
          </button>
        ))}
      </div>
    </div>
  );
};
