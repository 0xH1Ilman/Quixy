import React from 'react';
import type { StockScreenerResult, KeyMetric, Chart } from '../types';
import SpecificChart from './SpecificChart';

interface StockScreenerViewProps {
  results: StockScreenerResult;
}

const KeyMetricCard: React.FC<{ metric: KeyMetric }> = ({ metric }) => (
    <div className="bg-background/50 border border-border/50 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-slate-300">{metric.name}</h4>
        <p className="text-lg font-bold text-slate-100">{metric.value}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{metric.explanation}</p>
    </div>
);

const StockScreenerView: React.FC<StockScreenerViewProps> = ({ results }) => {
  const { query_summary, stock, charts } = results;

  return (
    <div className="space-y-4 animate-fadeIn">
        {results.conversational_response && <p className="text-lg px-4 text-slate-300">{results.conversational_response}</p>}
        <div className="bg-card border border-border p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-1 text-card-foreground">Resultado Principal</h2>
            <p className="text-muted-foreground mb-6">{query_summary}</p>
            
            {stock ? (
                 <div className="bg-background/50 border border-border/50 p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-100">{stock.company_name}</h3>
                            <p className="text-lg text-primary font-mono">{stock.ticker}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-3xl font-light text-slate-200">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stock.current_price)}
                             </p>
                             <p className="text-sm text-muted-foreground">Precio Actual</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="font-semibold text-card-foreground mb-2">Justificación</h4>
                        <p className="text-slate-300 leading-relaxed">{stock.justification}</p>
                    </div>

                    {stock.key_metrics && stock.key_metrics.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-card-foreground mb-3">Métricas Clave</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stock.key_metrics.map((metric, index) => <KeyMetricCard key={index} metric={metric} />)}
                            </div>
                        </div>
                    )}
                    
                    {charts && charts.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-card-foreground mb-3">{charts[0].title}</h4>
                            <div className="bg-card border border-border/50 p-4 rounded-lg h-96">
                                <SpecificChart chart={charts[0]} />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No se encontró una acción que coincida con los criterios especificados.</p>
            )}
        </div>
    </div>
  );
};

export default StockScreenerView;