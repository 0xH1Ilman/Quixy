import React from 'react';
import type { SectorPerformanceResponse } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface SectorPerformanceViewProps {
  isEmbeddedInChat?: boolean;
}

const SectorPerformanceView: React.FC<SectorPerformanceViewProps> = ({ isEmbeddedInChat = false }) => {
  const { appData, refreshView, loadingStates } = useDataContext();
  const performance = appData.sectorPerformance;
  const isLoading = loadingStates.sectors;
  const containerPadding = isEmbeddedInChat ? 'p-0' : 'p-6';
  
  if (!performance && !isLoading) {
    return (
       <div className={`flex items-center justify-center h-full text-muted-foreground text-center ${containerPadding}`}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Rendimiento Sectorial</h2>
          <p>No se pudieron cargar los datos. Intenta de nuevo.</p>
           <button onClick={() => refreshView('sectors')} className="mt-4 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md">Refrescar</button>
        </div>
      </div>
    );
  }

  const { time_period, summary, performance_data } = performance || {};

  return (
    <div className={`space-y-4 overflow-y-auto h-full ${containerPadding}`}>
      {!isEmbeddedInChat && (
         <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-200">Rendimiento Sectorial</h1>
           <button
              onClick={() => refreshView('sectors')}
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
      
      {isLoading && !performance && (
         <div className="flex items-center justify-center h-full text-muted-foreground">
            <span>Cargando rendimiento sectorial...</span>
          </div>
      )}

      {performance && (
        <>
            {performance.conversational_response && <p className="text-lg text-slate-300">{performance.conversational_response}</p>}
            
            <div className="bg-card border border-border p-5 rounded-lg">
                <p className="text-sm text-muted-foreground">Periodo: <span className="font-bold text-slate-300">{time_period}</span></p>
                <p className="text-slate-300 mt-2 leading-relaxed">{summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performance_data?.map((sector, index) => {
                const performancePercentage = parseFloat(String(sector.performance_percentage));
                const isValidPercentage = !isNaN(performancePercentage);
                return (
                    <div key={index} className="bg-card border border-border p-4 rounded-lg flex flex-col">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold text-slate-200">{sector.sector_name}</h3>
                        <p className={`text-xl font-bold ${isValidPercentage && performancePercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                        {isValidPercentage ? `${performancePercentage.toFixed(2)}%` : String(sector.performance_percentage)}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 flex-grow">{sector.rationale}</p>
                    <div className="mt-4 pt-3 border-t border-border/50">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2">ACCIONES LÍDERES</h4>
                        <div className="flex flex-wrap gap-2">
                        {(sector.leading_stocks || []).map((stock, s_index) => (
                            <div key={s_index} className="bg-background/50 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="font-bold text-slate-300">{stock.ticker}</span>
                            <span className={stock.change.startsWith('+') ? 'text-success' : 'text-danger'}>{stock.change}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
        </>
      )}
    </div>
  );
};

export default SectorPerformanceView;