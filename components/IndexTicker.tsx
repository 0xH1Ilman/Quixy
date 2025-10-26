import React from 'react';
import type { IndexPerformance } from '../types';
import { useDataContext } from '../contexts/DataContext';

const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-success';
    if (change.startsWith('-')) return 'text-danger';
    return 'text-muted-foreground';
};

const IndexTicker: React.FC = () => {
  const { appData, loadingStates } = useDataContext();
  const indices = appData.indexPerformance;
  const isLoading = loadingStates.ticker;

  const tickerContent = (
    <>
      {indices && indices.map((index, i) => (
        <div key={i} className="mx-6 flex items-baseline">
          <span className="font-semibold text-sm text-slate-300">{index.index_name}: </span>
          <span className="ml-2 font-mono text-sm text-slate-100">{index.value}</span>
          <span className={`ml-2 font-mono text-xs ${getChangeColor(index.change)}`}>{index.change} ({index.change_percentage})</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="relative flex overflow-hidden border-b border-border/50 bg-card/50 py-3 flex-shrink-0">
      <div className="animate-marquee whitespace-nowrap flex">
        {isLoading && Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="mx-6 h-5 w-48 bg-muted/50 rounded-md animate-pulse"></div>
        ))}
        {indices && (
          <>
            {tickerContent}
            {tickerContent}
          </>
        )}
      </div>
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-background via-transparent to-background pointer-events-none"></div>
    </div>
  );
};

export default IndexTicker;