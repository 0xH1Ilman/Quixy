import React, { useState } from 'react';
import { getFinancialResponse } from '../services/geminiService';
import type { StockScreenerResult } from '../types';
import StockScreenerView from './StockScreenerView';

const StockScreenerPageView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockScreenerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const exampleQueries = [
    "acciones de IA con un P/E bajo",
    "empresas de energía renovable con buen crecimiento",
    "acciones de dividendos estables en el sector salud",
    "empresas tecnológicas infravaloradas con potencial a largo plazo"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await getFinancialResponse(`Busca una acción que coincida con: "${searchQuery}".`);
      if (response.response_type === 'stock_screener' && response.screener_results) {
        setResults(response.screener_results);
      } else {
        setError(response.conversational_response || "No se pudo realizar la búsqueda con esos criterios.");
      }
    } catch (err) {
      setError("Ocurrió un error al usar el buscador. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Buscador de Acciones con IA</h2>
        <p className="text-muted-foreground">Describe qué tipo de acción buscas y Quixy la encontrará por ti.</p>
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 mt-4">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: 'Acciones de tecnología con bajo P/E...'"
                className="w-full max-w-xl bg-card text-foreground rounded-lg p-2.5 border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button 
                type="submit" 
                className="bg-primary text-primary-foreground font-bold py-2.5 px-5 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                disabled={isLoading || !query.trim()}
            >
                {isLoading ? 'Buscando...' : 'Buscar'}
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
                <p>Analizando el mercado...</p>
            </div>
        )}
        {error && <div className="text-danger bg-danger/10 p-4 rounded-lg">{error}</div>}
        {results && <StockScreenerView results={results} />}
        {!isLoading && !results && !error && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-card/30 rounded-xl border-2 border-dashed border-border">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                <p className="mb-4 text-lg font-semibold text-card-foreground">Los resultados del buscador aparecerán aquí.</p>
                <p className="mb-4 text-sm">Prueba con una de estas ideas:</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                    {exampleQueries.map(ex => (
                        <button 
                            key={ex} 
                            onClick={() => { setQuery(ex); handleSearch(ex); }}
                            className="bg-card/80 border border-border text-xs px-3 py-1.5 rounded-full hover:bg-muted hover:border-primary/50 transition-all"
                        >
                           {ex}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default StockScreenerPageView;