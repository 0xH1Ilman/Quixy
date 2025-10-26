import React from 'react';
import type { EconomicIndicatorsResponse } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface EconomicIndicatorsViewProps {
  isEmbeddedInChat?: boolean;
}

const TrendIcon: React.FC<{ trend: 'Subiendo' | 'Bajando' | 'Estable' }> = ({ trend }) => {
    if (trend === 'Subiendo') return <span className="text-danger">▲</span>;
    if (trend === 'Bajando') return <span className="text-success">▼</span>;
    return <span className="text-yellow-400">▬</span>;
};

const EconomicIndicatorsView: React.FC<EconomicIndicatorsViewProps> = ({ isEmbeddedInChat = false }) => {
  const { appData, refreshView, loadingStates } = useDataContext();
  const indicators = appData.economicIndicators;
  const isLoading = loadingStates.indicators;
  const containerPadding = isEmbeddedInChat ? 'p-0' : 'p-6';
  
  if (!indicators && !isLoading) {
    return (
       <div className={`flex items-center justify-center h-full text-muted-foreground text-center ${containerPadding}`}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Indicadores Económicos</h2>
          <p>No se pudieron cargar los datos. Intenta de nuevo.</p>
           <button onClick={() => refreshView('indicators')} className="mt-4 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md">Refrescar</button>
        </div>
      </div>
    );
  }
  
  const { summary, indicators: indicatorList } = indicators || {};

  return (
    <div className={`space-y-4 overflow-y-auto h-full ${containerPadding}`}>
      {!isEmbeddedInChat && (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-200">Indicadores Económicos</h1>
            <button
              onClick={() => refreshView('indicators')}
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

      {isLoading && !indicators && (
         <div className="flex items-center justify-center h-full text-muted-foreground">
            <span>Cargando indicadores económicos...</span>
          </div>
      )}
      
      {indicators && (
        <>
            {indicators.conversational_response && <p className="text-lg text-slate-300">{indicators.conversational_response}</p>}
            
            <div className="bg-card border border-border p-5 rounded-lg">
                <p className="text-slate-300 mb-6 leading-relaxed">{summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicatorList?.map((indicator, index) => (
                    <div key={index} className="bg-background/50 border border-border/50 p-4 rounded-lg flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">{indicator.name}</h3>
                    <p className="text-3xl font-bold text-gray-300 mb-2">
                        {indicator.value} <TrendIcon trend={indicator.trend} />
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">{indicator.period}</p>
                    <p className="text-sm text-slate-300 flex-grow">{indicator.interpretation}</p>
                    </div>
                ))}
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default EconomicIndicatorsView;