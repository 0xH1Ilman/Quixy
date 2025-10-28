import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import PortfolioView from './components/PortfolioView';
import MarketSummaryView from './components/MarketSummaryView';
import StockChartView from './components/StockChartView';
import EconomicIndicatorsView from './components/EconomicIndicatorsView';
import CommoditiesForexView from './components/CommoditiesForexView';
import DashboardHomeView from './components/HomeScreen';
import LoadingScreen from './components/LoadingScreen';
import StockScreenerPageView from './components/StockScreenerPageView';
import NewsView from './components/NewsView';
import LocalMarketView from './components/LocalMarketView';
import IndexTicker from './components/IndexTicker';
import SettingsView from './components/SettingsView';
import type { View } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'loading' | 'ready'>('loading');
  const [currentView, setCurrentView] = useState<View | 'home'>('home');
  const [initialTicker, setInitialTicker] = useState<string | null>(null);

  if (appState === 'loading') {
    return <LoadingScreen onLoaded={() => setAppState('ready')} />;
  }
  
  const handleSetView = (view: View | 'home', params?: { ticker?: string }) => {
    if (view === 'charts' && params?.ticker) {
      setInitialTicker(params.ticker);
    } else {
      // Reset ticker if navigating away or to a view that doesn't need it
      setInitialTicker(null);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <Chatbot />;
      case 'portfolio':
        return <PortfolioView />;
      case 'market':
        return <MarketSummaryView />;
      case 'charts':
        return <StockChartView initialTicker={initialTicker} />;
      case 'indicators':
        return <EconomicIndicatorsView />;
      case 'commodities_forex':
        return <CommoditiesForexView />;
      case 'screener':
        return <StockScreenerPageView />;
      case 'news':
        return <NewsView />;
      case 'local_market':
        return <LocalMarketView />;
      case 'settings':
        return <SettingsView />;
    }
  };
  
  if (currentView === 'home') {
    return <DashboardHomeView onSetView={handleSetView} />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar currentView={currentView} onSetView={handleSetView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <IndexTicker />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;