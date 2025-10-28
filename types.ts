import type { ReactElement } from "react";

export type View = 'chat' | 'portfolio' | 'market' | 'charts' | 'indicators' | 'commodities_forex' | 'screener' | 'news' | 'local_market' | 'settings';

export interface NavItemProps {
  icon: ReactElement;
  label: string;
  view: View;
  isActive: boolean;
  onClick: (view: View | 'home') => void;
}

// Fix: Replaced incorrect component code with proper type definitions.
export interface WebSource {
  uri: string;
  title: string;
}

export interface NewsArticle {
  uri: string;
  title: string;
  source: string;
  summary: string;
  image_url?: string;
}

export interface NewsResponse {
    articles: NewsArticle[];
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface ChartDataKey {
  key: string;
  name: string;
  color: string;
}

export interface Chart {
  type: 'composed' | 'line' | 'bar' | 'radar';
  title: string;
  timeframes?: string[];
  data: ChartDataPoint[] | Record<string, ChartDataPoint[]>;
  dataKeys: ChartDataKey[];
}

export interface KeyMetric {
    name: string;
    value: string;
    explanation: string;
}

export interface StockAnalysis {
  company_name: string;
  ticker: string;
  current_price: number;
  price_change: number;
  change_percentage: number;
  recommendation: 'Buy' | 'Sell' | 'Hold';
  price_target: number;
  summary: string;
  market_sentiment: 'Positivo' | 'Negativo' | 'Neutral';
  key_metrics?: KeyMetric[];
  financial_highlights?: any[];
  debt_analysis?: any[];
  competitor_analysis?: any[];
}

export interface PortfolioAsset {
    company_name: string;
    ticker: string;
    allocation_percentage: number;
    rationale: string;
}

export interface Portfolio {
    id: string;
    created_at: string;
    strategy_name: string;
    total_capital: number;
    risk_level: string;
    investment_horizon: string;
    strategy_rationale: string;
    assets?: PortfolioAsset[];
    conversational_response?: string;
    estimated_annual_return?: string;
    historical_performance?: {
        one_year: string;
        three_year_annualized: string;
        five_year_annualized: string;
    };
    risk_analysis?: {
        beta: string;
        standard_deviation: string;
        summary: string;
    };
    charts?: Chart[];
}

export interface IndexPerformance {
    index_name: string;
    value: string;
    change: string;
    change_percentage: string;
}

export interface MarketMover {
    ticker: string;
    company_name: string;
    price: string;
    change: string;
    change_percentage: string;
}

export interface SectorSnapshot {
    sector_name: string;
    change_percentage: number;
}

export interface EconomicEvent {
    event_name: string;
    date: string;
    impact: 'Alto' | 'Medio' | 'Bajo';
}

export interface MarketSummary {
    market_sentiment: 'Alcista' | 'Bajista' | 'Neutral';
    summary_text: string;
    index_performance: IndexPerformance[];
    top_gainers: MarketMover[];
    top_losers: MarketMover[];
    sector_performance: SectorSnapshot[];
    economic_calendar: EconomicEvent[];
    conversational_response?: string;
    news?: NewsArticle[];
}

export interface LocalMarketMover {
    ticker: string;
    company_name: string;
    price: string;
    change_percentage: string;
}

export interface LocalMarketSummary {
    market_sentiment: 'Positivo' | 'Negativo' | 'Neutral';
    summary_text: string;
    colcap_performance: IndexPerformance;
    key_stocks: LocalMarketMover[];
    news: NewsArticle[];
}

export interface LocalMarketResponse {
    summary: LocalMarketSummary;
    conversational_response?: string;
}


export interface ScreenerStock {
    company_name: string;
    ticker: string;
    current_price: number;
    justification: string;
    key_metrics?: KeyMetric[];
}

export interface StockScreenerResult {
    query_summary: string;
    stock?: ScreenerStock;
    charts?: Chart[];
    conversational_response?: string;
}

export interface EconomicIndicator {
    name: string;
    value: string;
    trend: 'Subiendo' | 'Bajando' | 'Estable';
    period: string;
    interpretation: string;
}

export interface EconomicIndicatorsResponse {
    summary: string;
    indicators?: EconomicIndicator[];
    conversational_response?: string;
}

export interface Commodity {
    name: string;
    price: string;
    change: string;
    change_percentage: string;
    unit: string;
}

export interface ForexPair {
    pair: string;
    rate: string;
    change: string;
    change_percentage: string;
}

export interface CommoditiesForexResponse {
    summary: string;
    commodities?: Commodity[];
    forex_pairs?: ForexPair[];
    conversational_response?: string;
}

export interface ApiResponse {
  response_type: 'stock_analysis' | 'portfolio_creation' | 'market_summary' | 'stock_screener' | 'economic_indicators' | 'commodities_forex' | 'local_market_summary' | 'news' | 'general_text';
  conversational_response: string;
  stock_analysis?: StockAnalysis;
  portfolio_details?: Portfolio;
  market_summary?: MarketSummary;
  screener_results?: StockScreenerResult;
  economic_indicators?: EconomicIndicatorsResponse;
  commodities_forex?: CommoditiesForexResponse;
  local_market_summary?: LocalMarketResponse;
  charts?: Chart[];
  news?: NewsArticle[];
  sources?: WebSource[];
}

export interface Message {
  sender: 'user' | 'bot';
  text?: string;
  analysis?: ApiResponse;
  isLoading?: boolean;
}