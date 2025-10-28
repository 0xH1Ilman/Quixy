import React, { useEffect } from 'react';
import type { MarketSummary, IndexPerformance, MarketMover, SectorSnapshot } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface MarketSummaryViewProps {
  isEmbeddedInChat?: boolean;
}

const getChangeColor = (change: string | number) => {
    if (typeof change === 'string') {
        if (change.startsWith('+')) return 'text-success';
        if (change.startsWith('-')) return 'text-danger';
    }
    if (typeof change === 'number') {
        if (change > 0) return 'text-success';
        if (change < 0) return 'text-danger';
    }
    return 'text-muted-foreground';
};

const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'alcista': return 'bg-success/20 text-success';
      case 'bajista': return 'bg-danger/20 text-danger';
      default: return 'bg-yellow-400/20 text-yellow-400';
    }
};

const IndexCard: React.FC<{ index: IndexPerformance }> = ({ index }) => (
    <div className="bg-background/60 p-4 rounded-lg border border-border/50">
        <p className="text-sm font-semibold text-muted-foreground">{index.index_name}</p>
        <p className="text-2xl font-bold mt-1 text-card-foreground">{index.value}</p>
        <p className={`text-sm font-semibold mt-1 ${getChangeColor(index.change_percentage)}`}>
            {index.change} ({index.change_percentage})
        </p>
    </div>
);

const MoverTable: React.FC<{ title: string, movers: MarketMover[] }> = ({ title, movers }) => (
    <div className="bg-card/80 border border-border rounded-xl p-4 h-full">
        <h4 className="font-bold mb-3 text-card-foreground">{title}</h4>
        <div className="space-y-3">
            {movers.slice(0, 5).map(mover => (
                <div key={mover.ticker} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-bold text-primary">{mover.ticker}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{mover.company_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-card-foreground">{mover.price}</p>
                        <p className={`font-mono text-xs ${getChangeColor(mover.change_percentage)}`}>{mover.change_percentage}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SectorPerformanceChart: React.FC<{ sectors: SectorSnapshot[] }> = ({ sectors }) => {
    const parsePercentage = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    return (
        <div className="bg-card/80 border border-border rounded-xl p-4 h-full">
            <h4 className="font-bold mb-3 text-card-foreground">Rendimiento por Sector</h4>
            <div className="space-y-2">
                {sectors.map(sector => {
                    const numChange = parsePercentage(sector.change_percentage);
                    return (
                        <div key={sector.sector_name}>
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="font-semibold text-muted-foreground">{sector.sector_name}</span>
                                <span className={`font-mono font-semibold ${getChangeColor(numChange)}`}>{numChange.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${numChange > 0 ? 'bg-success' : 'bg-danger'}`}
                                    style={{ width: `${Math.min(Math.abs(numChange) * 20, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MarketSummaryContent: React.FC<{ summary: MarketSummary }> = ({ summary }) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            {summary.conversational_response && <p className="text-lg text-muted-foreground px-1">{summary.conversational_response}</p>}
            
            <div className="bg-card border border-border p-5 rounded-xl">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-card-foreground">Sentimiento del Mercado</h3>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getSentimentColor(summary.market_sentiment)}`}>
                        {summary.market_sentiment}
                    </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">{summary.summary_text}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summary.index_performance.map(index => <IndexCard key={index.index_name} index={index} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <MoverTable title="Mayores Ganadoras" movers={summary.top_gainers} />
                <MoverTable title="Mayores Perdedoras" movers={summary.top_losers} />
                <SectorPerformanceChart sectors={summary.sector_performance} />
            </div>
        </div>
    );
};


const MarketSummaryView: React.FC<MarketSummaryViewProps> = ({ isEmbeddedInChat = false }) => {
    const { appData, loadingStates, refreshView } = useDataContext();
    const summary = appData.marketSummary;
    const isLoading = loadingStates.market;

    useEffect(() => {
        if (!isEmbeddedInChat && !summary) {
            refreshView('market');
        }
    }, [isEmbeddedInChat, summary, refreshView]);

    const handleRefresh = () => {
        refreshView('market');
    };

    if (isLoading && !summary) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando resumen del mercado...</div>;
    }

    if (!summary) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos del mercado disponibles.</div>;
    }

    if (isEmbeddedInChat) {
        return <MarketSummaryContent summary={summary} />;
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-card-foreground">Resumen del Mercado Global</h2>
                    <p className="text-muted-foreground">Una vista completa del pulso financiero de hoy.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-secondary text-secondary-foreground hover:bg-muted px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
                    {isLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
            </header>
            <MarketSummaryContent summary={summary} />
        </div>
    );
};

export default MarketSummaryView;