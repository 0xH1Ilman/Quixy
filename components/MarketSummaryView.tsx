import React from 'react';
import type { MarketSummary, MarketMover } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface MarketSummaryViewProps {
  isEmbeddedInChat?: boolean;
}

const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
        case 'alcista': return 'text-success';
        case 'bajista': return 'text-danger';
        default: return 'text-yellow-400';
    }
};

const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-success';
    if (change.startsWith('-')) return 'text-danger';
    return 'text-gray-400';
};

const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
        case 'alto': return 'bg-danger/20 text-danger';
        case 'medio': return 'bg-yellow-400/20 text-yellow-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
}

const MarketSummaryView: React.FC<MarketSummaryViewProps> = ({ isEmbeddedInChat = false }) => {
  const { appData, refreshView, loadingStates } = useDataContext();
  const summary = appData.marketSummary;
  const isLoading = loadingStates.market;
  const containerPadding = isEmbeddedInChat ? 'p-0' : 'p-6';
  
  if (!summary && !isLoading) {
    return (
      <div className={`flex items-center justify-center h-full text-muted-foreground text-center ${containerPadding}`}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Resumen de Mercado</h2>
          <p>No se pudieron cargar los datos. Intenta de nuevo.</p>
           <button onClick={() => refreshView('market')} className="mt-4 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md">Refrescar</button>
        </div>
      </div>
    );
  }

  const { market_sentiment, summary_text, index_performance, top_gainers, top_losers, sector_performance, economic_calendar } = summary || {};

  const MoverCard: React.FC<{ mover: MarketMover }> = ({ mover }) => (
    <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
        <div>
            <p className="font-bold text-sm text-slate-200">{mover.ticker}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{mover.company_name}</p>
        </div>
        <div className="text-right">
            <p className="font-mono text-sm font-semibold text-slate-300">{mover.price}</p>
            <p className={`text-xs font-mono ${getChangeColor(mover.change)}`}>{mover.change_percentage}</p>
        </div>
    </div>
  );

  return (
    <div className={`space-y-4 overflow-y-auto h-full ${containerPadding}`}>
      {!isEmbeddedInChat && (
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-200">Resumen de Mercado</h1>
          <button
              onClick={() => refreshView('market')}
              disabled={isLoading}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
             </svg>
              {isLoading ? 'Cargando...' : 'Refrescar'}
          </button>
        </div>
      )}
      
      {isLoading && !summary && (
         <div className="flex items-center justify-center h-full text-muted-foreground">
            <span>Cargando resumen del mercado...</span>
          </div>
      )}

      {summary && (
        <>
          {summary.conversational_response && <p className="text-lg text-slate-300">{summary.conversational_response}</p>}
          
          <div className="bg-card border border-border p-5 rounded-lg">
            <p className="text-sm text-muted-foreground">Sentimiento del Mercado: <span className={`font-bold ${getSentimentColor(market_sentiment || '')}`}>{market_sentiment}</span></p>
            <p className="text-slate-300 mt-2 leading-relaxed">{summary_text}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(index_performance || []).map(index => (
              <div key={index.index_name} className="bg-card border border-border p-4 rounded-lg">
                <h3 className="font-semibold text-card-foreground">{index.index_name}</h3>
                <p className="text-2xl font-bold text-slate-200 mt-1">{index.value}</p>
                <p className={`text-sm font-semibold ${getChangeColor(index.change)}`}>{index.change} ({index.change_percentage})</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border p-4 rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2">Principales Ganadores</h3>
              <div className="space-y-1">{(top_gainers || []).map((g, i) => <MoverCard key={i} mover={g} />)}</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2">Principales Perdedores</h3>
              <div className="space-y-1">{(top_losers || []).map((l, i) => <MoverCard key={i} mover={l} />)}</div>
            </div>
          </div>
          
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border p-4 rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2">Rendimiento por Sector</h3>
               <div className="space-y-2 mt-3">
                  {(sector_performance || []).map((s, i) => {
                    const percentage = parseFloat(String(s.change_percentage));
                    const isValidPercentage = !isNaN(percentage);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{s.sector_name}</span>
                          <span className={isValidPercentage && percentage >= 0 ? 'text-success' : 'text-danger'}>
                            {isValidPercentage ? `${percentage.toFixed(2)}%` : s.change_percentage}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className={`${isValidPercentage && percentage >= 0 ? 'bg-success' : 'bg-danger'} h-1.5 rounded-full`}
                            style={{ width: isValidPercentage ? `${Math.min(Math.abs(percentage) * 20, 100)}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
            <div className="bg-card border border-border p-4 rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2">Calendario Económico</h3>
              <div className="space-y-2 mt-3">
                  {(economic_calendar || []).map((e, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                        <div>
                            <p className="text-slate-200 font-medium">{e.event_name}</p>
                            <p className="text-xs text-muted-foreground">{e.date}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getImpactColor(e.impact)}`}>{e.impact}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketSummaryView;