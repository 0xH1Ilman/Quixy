import React, { useState } from 'react';
import type { StockScreenerResult } from '../types';
import { getFinancialResponse } from '../services/geminiService';
import StockScreenerView from './StockScreenerView';

const StockScreenerPageView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockScreenerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (queryToSearch: string) => {
    if (!queryToSearch) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const prompt = `Encuentra acciones que cumplan con los siguientes criterios: "${queryToSearch}". Incluye métricas clave y un gráfico de precios del último año para la acción encontrada.`;
      const response = await getFinancialResponse(prompt);

      if (response.response_type === 'stock_screener' && response.screener_results) {
        setResults(response.screener_results);
      } else {
        setError(response.conversational_response || `No se encontraron resultados para tu búsqueda. Intenta ser más específico.`);
      }
    } catch (err) {
      setError('Ocurrió un error al buscar los datos. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query.trim());
  };
  
  const exampleQueries = [
      "acciones de IA infravaloradas",
      "empresas de energía renovable con buen crecimiento",
      "acciones con dividendos sólidos y baja volatilidad",
      "tecnológicas de gran capitalización con potencial de subida"
  ];

  return (
    <div className="p-6 overflow-y-auto h-full space-y-4">
      <h1 className="text-3xl font-bold text-slate-200">Buscador de Acciones</h1>
      <p className="text-muted-foreground">Describe los criterios de las acciones que buscas y Quixy las encontrará por ti.</p>
      
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 bg-card p-2 rounded-lg border border-border">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: acciones de IA infravaloradas con bajo P/E..."
          className="w-full bg-transparent text-slate-200 focus:outline-none placeholder-muted-foreground px-2 py-2 sm:py-0"
          aria-label="Criterios de búsqueda"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      <div className="mt-4">
        {isLoading && (
           <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analizando el mercado según tus criterios...</span>
            </div>
          </div>
        )}
        
        {error && <div className="text-red-400 text-center bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>}

        {!isLoading && !error && results && (
          <div className="animate-fadeIn">
            <StockScreenerView results={results} />
          </div>
        )}

        {!isLoading && !results && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center border-2 border-dashed border-border rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="font-semibold mb-2">Usa lenguaje natural para encontrar oportunidades de inversión.</p>
                <div className="text-xs text-left space-y-1">
                    <p><strong className="text-slate-400">Puedes probar con:</strong></p>
                    <ul className="list-disc list-inside">
                        {exampleQueries.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default StockScreenerPageView;