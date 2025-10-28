import React, { useState } from 'react';
import { useDataContext } from '../contexts/DataContext';

const SettingsView: React.FC = () => {
  const { appData, setTickerTape } = useDataContext();
  const { tickerTape } = appData;
  const [newTicker, setNewTicker] = useState('');

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTicker = newTicker.trim().toUpperCase();
    if (formattedTicker && !tickerTape.includes(formattedTicker)) {
      setTickerTape([...tickerTape, formattedTicker]);
      setNewTicker('');
    }
  };

  const handleRemoveTicker = (tickerToRemove: string) => {
    setTickerTape(tickerTape.filter(t => t !== tickerToRemove));
  };

  return (
    <div className="p-6 h-full flex flex-col animate-fadeIn">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Ajustes</h2>
        <p className="text-muted-foreground">Personaliza la configuración de tu aplicación.</p>
      </header>

      <div className="bg-card/80 border border-border rounded-xl p-6 max-w-2xl">
        <h3 className="text-xl font-bold text-card-foreground mb-4">Cinta de Tickers</h3>
        <p className="text-sm text-muted-foreground mb-4">Añade o elimina los símbolos que aparecen en la cinta de cotizaciones superior. Los cambios se aplicarán al instante.</p>
        
        <form onSubmit={handleAddTicker} className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            placeholder="Añadir símbolo (ej: MSFT)"
            className="w-full bg-input text-foreground rounded-lg p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
            disabled={!newTicker.trim()}
          >
            Añadir
          </button>
        </form>

        <div className="space-y-2">
          {tickerTape.map((ticker) => (
            <div key={ticker} className="flex justify-between items-center bg-background/60 p-2 rounded-md">
              <span className="font-mono font-semibold text-card-foreground">{ticker}</span>
              <button
                onClick={() => handleRemoveTicker(ticker)}
                className="text-muted-foreground hover:text-danger p-1 rounded-full"
                aria-label={`Eliminar ${ticker}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {tickerTape.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No hay tickers para mostrar. ¡Añade uno!</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
