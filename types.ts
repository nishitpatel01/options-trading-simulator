
export interface StockDataPoint {
  day: number;
  price: number;
}

export enum OptionType {
  Call = 'call',
  Put = 'put',
}

export interface OptionPosition {
  id: number;
  type: OptionType;
  strikePrice: number;
  expirationDay: number;
  purchaseDay: number;
  contracts: number;
  costBasis: number; // total cost
  initialStockPrice: number;
  currentValue: number;
  pnl: number;
}

export interface TradeParams {
  type: OptionType;
  strikePrice: number;
  expirationDays: number;
  contracts: number;
}

export enum MarketScenario {
    Classic = 'Classic',
    Bullish = 'Bullish',
    Bearish = 'Bearish',
    Volatile = 'Volatile',
    Sideways = 'Sideways',
}
