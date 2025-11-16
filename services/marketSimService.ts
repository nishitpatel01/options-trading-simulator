
import { INITIAL_STOCK_PRICE, VOLATILITY } from '../constants';
import type { StockDataPoint, OptionType } from '../types';
import { OptionType as OptionTypeEnum, MarketScenario } from '../types';

export function generateInitialStockData(days: number, scenario: MarketScenario): StockDataPoint[] {
  const data: StockDataPoint[] = [];
  let price = INITIAL_STOCK_PRICE;
  data.push({ day: 0, price });

  for (let i = 1; i < days; i++) {
    let drift = 0;
    let currentVolatility = VOLATILITY;

    switch (scenario) {
      case MarketScenario.Bullish:
        drift = 0.0011; // Small positive drift
        break;
      case MarketScenario.Bearish:
        drift = -0.0011; // Small negative drift
        break;
      case MarketScenario.Volatile:
        currentVolatility = VOLATILITY * 2.5;
        break;
      case MarketScenario.Sideways:
        // Revert to mean
        price = price * 0.95 + INITIAL_STOCK_PRICE * 0.05;
        currentVolatility = VOLATILITY / 2;
        break;
      case MarketScenario.Classic:
      default:
         drift = (Math.random() < 0.505 ? 0.0005 : -0.0005);
        break;
    }

    const change = (Math.random() - 0.5 + drift) * currentVolatility * price;
    price += change;
    price = Math.max(price, 1); // Prevent price from going to 0 or negative
    data.push({ day: i, price });
  }
  return data;
}

// Simplified Black-Scholes-like model for option premium
export function calculateOptionPremium(
  stockPrice: number,
  strikePrice: number,
  daysToExpiration: number,
  volatility: number,
  optionType: OptionType
): number {
    // Intrinsic Value
    let intrinsicValue = 0;
    if (optionType === OptionTypeEnum.Call) {
        intrinsicValue = Math.max(0, stockPrice - strikePrice);
    } else { // Put
        intrinsicValue = Math.max(0, strikePrice - stockPrice);
    }
    
    if (daysToExpiration <= 0) {
        return intrinsicValue;
    }

    // Time Value (simplified)
    const timeValue = 0.5 * volatility * (stockPrice / 20) * Math.sqrt(daysToExpiration / 365);

    return intrinsicValue + timeValue;
}
