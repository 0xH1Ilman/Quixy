import React from 'react';
import type { Message as MessageType, ApiResponse } from '../types';
import AnalysisCard from './AnalysisCard';
import PortfolioView from './PortfolioView';
import MarketSummaryView from './MarketSummaryView';
import StockScreenerView from './StockScreenerView';
import EconomicIndicatorsView from './EconomicIndicatorsView';
import CommoditiesForexView from './CommoditiesForexView';
import { useDataContext } from '../contexts/DataContext';
import BrandLogo from './QuixyLogo';

interface MessageProps {
  message: MessageType;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 bg-card px-4 py-3 rounded-lg">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);


const Message: React.FC<MessageProps> = ({ message }) => {
  const { savePortfolio } = useDataContext();
  const isBot = message.sender === 'bot';

  const handleSavePortfolio = () => {
    if (message.analysis?.portfolio_details) {
      const name = prompt("Dale un nombre a este portafolio:", message.analysis.portfolio_details.strategy_name);
      if (name) {
        const portfolioToSave = {
          ...message.analysis.portfolio_details,
          charts: message.analysis.charts,
        };
        savePortfolio(portfolioToSave, name);
        alert(`Portafolio "${name}" guardado exitosamente.`);
      }
    }
  };

  const renderContent = () => {
    if (message.isLoading) {
      return <LoadingIndicator />;
    }

    if (message.analysis) {
      switch (message.analysis.response_type) {
        case 'stock_analysis':
          return <AnalysisCard analysis={message.analysis} />;
        case 'portfolio_creation':
          return message.analysis.portfolio_details ? (
            <div className="space-y-4">
              <PortfolioView portfolioData={message.analysis.portfolio_details} isEmbeddedInChat={true} />
              <button
                onClick={handleSavePortfolio}
                className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors"
              >
                Guardar Portafolio
              </button>
            </div>
          ) : null;
        case 'market_summary':
           return message.analysis.market_summary ? (
            <MarketSummaryView isEmbeddedInChat={true} />
          ) : null;
        case 'stock_screener':
           return message.analysis.screener_results ? (
            <StockScreenerView results={message.analysis.screener_results} />
          ) : null;
        case 'economic_indicators':
          return message.analysis.economic_indicators ? (
            <EconomicIndicatorsView isEmbeddedInChat={true} />
          ) : null;
        case 'commodities_forex':
          return message.analysis.commodities_forex ? (
            <CommoditiesForexView isEmbeddedInChat={true} />
          ) : null;
        case 'general_text':
        default:
          return (
             <div className="bg-card px-4 py-3 rounded-xl text-card-foreground">
                <p>{message.analysis.conversational_response}</p>
             </div>
          );
      }
    }

    return <p className="text-white">{message.text}</p>;
  };

  return (
    <div className={`flex animate-slideUpAndFadeIn items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
       {isBot && (
         <div className="w-8 h-8 flex-shrink-0 bg-card rounded-full flex items-center justify-center border border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary"><path d="M5.63604 18.364L12 12M18.364 5.63604L12 12M12 12L5.63604 5.63604M12 12L18.364 18.364M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </div>
       )}
      <div
        className={`max-w-3xl w-full ${
          !isBot && 'bg-gradient-to-br from-blue-600 to-blue-500 text-primary-foreground p-4 rounded-xl shadow-lg'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;