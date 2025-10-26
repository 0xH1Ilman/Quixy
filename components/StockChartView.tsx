import React, { useState, useEffect, useCallback } from 'react';
import type { Chart, StockAnalysis, KeyMetric } from '../types';
import { getFinancialResponse } from '../services/geminiService';
import SpecificChart from './SpecificChart';

interface StockChartViewProps {
  initialTicker: string | null;
}

const availableMetrics = ['P/E Ratio', 'Market Cap', 'EPS', 'Revenue', 'Dividend Yield'];
const availableChartTypes = ['Price/Volume', 'Price Line', 'Volume Bar'];

const KeyMetricCard: React.FC<{ metric: KeyMetric }> = ({ metric }) => (
    <div className="bg-background/50 border border-border/50 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-slate-300">{metric.name}</h4>
        <p className="text-lg font-bold text-slate-100">{metric.value}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{metric.explanation}</p>
    </div>
);


const StockChartView: React.FC<StockChartViewProps> = ({ initialTicker }) => {
  const [ticker, setTicker] = useState(initialTicker || '');
  const [chartData, setChartData] = useState<Chart | null>(null);
  const [stockAnalysis, setStockAnalysis] = useState<StockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedTicker, setSearchedTicker] = useState<string | null>(null);
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['P/E Ratio', 'Market Cap']);
  const [selectedChartType, setSelectedChartType] = useState<string>('Price/Volume');

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    );
  };

  const performSearch = useCallback(async (tickerToSearch: string) => {
    if (!tickerToSearch) return;

    setIsLoading(true);
    setError(null);
    setChartData(null);
    setStockAnalysis(null);
    setSearchedTicker(tickerToSearch);

    try {
      let chartTypeName;
      switch (selectedChartType) {
        case 'Price Line': chartTypeName = 'line'; break;
        case 'Volume Bar': chartTypeName = 'bar'; break;
        default: chartTypeName = 'composed';
      }

      const chartInstruction = `Dame un gráfico de tipo '${chartTypeName}' para la acción ${tickerToSearch} para los periodos de 30D, 90D y 1Y.`;
      const metricsInstruction = `Incluye también las siguientes métricas: ${selectedMetrics.join(', ')}.`;
      const prompt = `Analiza la acción ${tickerToSearch}. ${chartInstruction} ${selectedMetrics.length > 0 ? metricsInstruction : ''}`;

      const response = await getFinancialResponse(prompt);
      
      let foundChart = null;
      if (response.charts && response.charts.length > 0) {
        foundChart = response.charts[0];
        setChartData(foundChart);
      }
      
      if (response.stock_analysis) {
          setStockAnalysis(response.stock_analysis);
      }

      if (!foundChart && !response.stock_analysis?.key_metrics) {
        setError(`No se encontraron datos para ${tickerToSearch}. Por favor, verifica el símbolo.`);
      }

    } catch (err) {
      setError('Ocurrió un error al buscar los datos. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChartType, selectedMetrics]);

  useEffect(() => {
    if (initialTicker) {
      setTicker(initialTicker);
      performSearch(initialTicker);
    }
  }, [initialTicker, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(ticker.trim().toUpperCase());
  };

  return (
    <div className="p-6 overflow-y-auto h-full space-y-4">
      <h1 className="text-3xl font-bold text-slate-200">Análisis de Acciones</h1>
      
      <div className="bg-card p-4 rounded-lg border border-border space-y-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Buscar símbolo... Ej: AAPL, TSLA, NVDA"
            className="w-full bg-input text-foreground rounded-md p-2.5 border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            aria-label="Símbolo Bursátil"
            />
            <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground font-bold py-2.5 px-5 rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
            {isLoading ? 'Analizando...' : 'Analizar'}
            </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-slate-300">Tipo de Gráfico</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {availableChartTypes.map(type => (
                        <button 
                            key={type} 
                            onClick={() => setSelectedChartType(type)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${selectedChartType === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="text-sm font-medium text-slate-300">Métricas Adicionales</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {availableMetrics.map(metric => (
                        <button 
                            key={metric} 
                            onClick={() => handleMetricToggle(metric)} 
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${selectedMetrics.includes(metric) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                        >
                            {metric}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>


      <div className="mt-4">
        {isLoading && (
           <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Cargando datos...</span>
            </div>
          </div>
        )}
        
        {error && <div className="text-red-400 text-center bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>}

        {!isLoading && !error && (chartData || stockAnalysis) && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-100">{stockAnalysis?.company_name || searchedTicker}</h2>

            {stockAnalysis?.key_metrics && stockAnalysis.key_metrics.length > 0 && (
                <div className="bg-card border border-border p-5 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-card-foreground">Métricas Clave</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stockAnalysis.key_metrics.map((metric, index) => <KeyMetricCard key={index} metric={metric} />)}
                    </div>
                </div>
            )}
            
            {chartData && (
                 <div className="bg-card border border-border p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-card-foreground">{chartData.title}</h3>
                    <div style={{ width: '100%', height: 500 }}>
                        <SpecificChart chart={chartData} />
                    </div>
                </div>
            )}
          </div>
        )}

        {!isLoading && !chartData && !stockAnalysis && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center border-2 border-dashed border-border rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p>Ingresa un símbolo bursátil para ver su análisis detallado.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StockChartView;