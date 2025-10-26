import React from 'react';
import type { Message as MessageType } from '../types';
import AnalysisCard from './AnalysisCard';
import PortfolioView from './PortfolioView';
import MarketSummaryView from './MarketSummaryView';
import StockScreenerView from './StockScreenerView';
import EconomicIndicatorsView from './EconomicIndicatorsView';
import SectorPerformanceView from './SectorPerformanceView';
import { useDataContext } from '../contexts/DataContext';

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
        savePortfolio(message.analysis.portfolio_details, name);
        alert(`Portafolio "${name}" guardado exitosamente.`);
      }
    }
  };

  const renderContent = () => {
    if (message.isLoading) {
      return (
        <div className="flex items-center space-x-3 animate-fadeIn">
            <LoadingIndicator />
        </div>
      );
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
        case 'sector_performance':
          return message.analysis.sector_performance ? (
            <SectorPerformanceView isEmbeddedInChat={true} />
          ) : null;
        case 'general_text':
        default:
          return (
             <div className="flex items-start space-x-3">
              <div className="bg-card px-4 py-3 rounded-lg text-card-foreground">
                  <p>{message.analysis.conversational_response}</p>
              </div>
            </div>
          );
      }
    }

    return <p>{message.text}</p>;
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-4xl w-full p-0 ${
          isBot ? '' : 'bg-gradient-to-br from-blue-600 to-blue-500 text-primary-foreground p-4 rounded-xl shadow-lg'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;