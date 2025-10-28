import React, { useState, useEffect } from 'react';
import { getFinancialResponse } from '../services/geminiService';
import type { ApiResponse } from '../types';
import AnalysisCard from './AnalysisCard';

interface StockChartViewProps {
  initialTicker?: string | null;
}

const StockChartView: React.FC<StockChartViewProps> = ({ initialTicker }) => {
  const [ticker, setTicker] = useState(initialTicker || '');
  const [analysis, setAnalysis] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (symbol: string) => {
    if (!symbol) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const response = await getFinancialResponse(`Analiza la acción ${symbol}. Incluye historial de precios y volumen para 30D, 90D y 1A.`);
      if (response.response_type === 'stock_analysis') {
        setAnalysis(response);
      } else {
        setError(response.conversational_response || "No se pudo obtener un análisis para este símbolo.");
      }
    } catch (err) {
      setError("Ocurrió un error al buscar el análisis. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicker) {
      fetchAnalysis(initialTicker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTicker]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis(ticker.trim().toUpperCase());
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Análisis de Acciones</h2>
        <p className="text-muted-foreground">Busca un símbolo para obtener un análisis detallado en tiempo real.</p>
        <form onSubmit={handleSearch} className="flex items-center gap-2 mt-4">
            <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Buscar un símbolo... Ej: AAPL, TSLA, NVDA"
                className="w-full max-w-md bg-card text-foreground rounded-lg p-2.5 border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button 
                type="submit" 
                className="bg-primary text-primary-foreground font-bold py-2.5 px-5 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                disabled={isLoading || !ticker.trim()}
            >
                {isLoading ? 'Buscando...' : 'Analizar'}
            </button>
        </form>
      </header>
      <main className="flex-1 overflow-y-auto">
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <svg className="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Cargando análisis para {ticker.toUpperCase()}...</p>
            </div>
        )}
        {error && <div className="text-danger bg-danger/10 p-4 rounded-lg">{error}</div>}
        {analysis && <AnalysisCard analysis={analysis} />}
        {!isLoading && !analysis && !error && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-card/30 rounded-xl border-2 border-dashed border-border">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <p className="text-lg font-semibold text-card-foreground">Los resultados del análisis se mostrarán aquí.</p>
                <p>Ingresa un símbolo de acción para comenzar.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default StockChartView;