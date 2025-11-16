
import React from 'react';
import type { OptionPosition } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';

interface PortfolioProps {
  positions: OptionPosition[];
}

const PositionRow: React.FC<{ position: OptionPosition }> = ({ position }) => {
  const isCall = position.type === 'call';
  const isProfitable = position.pnl >= 0;

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700/50">
      <td className="p-3">
        <div className={`flex items-center font-bold ${isCall ? 'text-green-400' : 'text-red-400'}`}>
           {isCall ? <TrendingUpIcon /> : <TrendingDownIcon />}
           <span className="ml-2">{position.contracts}x {isCall ? 'CALL' : 'PUT'}</span>
        </div>
      </td>
      <td className="p-3 font-mono">${position.strikePrice.toFixed(2)}</td>
      <td className="p-3 font-mono">{position.expirationDay}</td>
      <td className="p-3 font-mono">${position.costBasis.toFixed(2)}</td>
      <td className="p-3 font-mono">${position.currentValue.toFixed(2)}</td>
      <td className={`p-3 font-mono font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
        {isProfitable ? '+' : ''}${position.pnl.toFixed(2)}
      </td>
    </tr>
  );
};


export const Portfolio: React.FC<PortfolioProps> = ({ positions }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">Open Positions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/30">
            <tr>
              <th className="p-3">Contract</th>
              <th className="p-3">Strike</th>
              <th className="p-3">Expires (Day)</th>
              <th className="p-3">Cost Basis</th>
              <th className="p-3">Current Value</th>
              <th className="p-3">P/L</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">No open positions.</td>
              </tr>
            ) : (
              positions.map(pos => <PositionRow key={pos.id} position={pos} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
