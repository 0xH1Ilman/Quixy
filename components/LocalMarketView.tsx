import React from 'react';
import type { LocalMarketResponse, IndexPerformance, LocalMarketMover, NewsArticle } from '../types';
import { useDataContext } from '../contexts/DataContext';

const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
        case 'positivo':
        case 'alcista': 
            return 'text-success';
        case 'negativo':
        case 'bajista':
            return 'text-danger';
        default: return 'text-yellow-400';
    }
};

const getChangeColor = (change: string) => {
    if (!change) return 'text-muted-foreground';
    if (change.startsWith('+') || !change.startsWith('-')) return 'text-success';
    if (change.startsWith('-')) return 'text-danger';
    return 'text-muted-foreground';
};

const NewsPlaceholder = () => (
    <div className="h-14 w-14 flex items-center justify-center bg-muted rounded-md shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1 8h.01" />
        </svg>
    </div>
);

const LocalMarketView: React.FC = () => {
    const { appData, refreshView, loadingStates } = useDataContext();
    const localMarketData = appData.localMarket;
    const isLoading = loadingStates.local_market;

    if (isLoading && !localMarketData) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <span>Cargando datos del mercado colombiano...</span>
            </div>
        );
    }
    
    if (!localMarketData) {
        return (
            <div className="p-6 flex items-center justify-center h-full text-muted-foreground text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Mercado Local (Colombia)</h2>
                    <p>No se pudieron cargar los datos. Intenta de nuevo.</p>
                    <button onClick={() => refreshView('local_market')} className="mt-4 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md">
                        Refrescar
                    </button>
                </div>
            </div>
        );
    }

    const { summary } = localMarketData;
    const { market_sentiment, summary_text, colcap_performance, key_stocks, news } = summary;

    return (
        <div className="p-6 overflow-y-auto h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-200">Mercado Local: Colombia</h1>
                <button
                    onClick={() => refreshView('local_market')}
                    disabled={isLoading}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
                    </svg>
                    {isLoading ? 'Cargando...' : 'Refrescar'}
                </button>
            </div>

            <div className="bg-card border border-border p-5 rounded-lg animate-fadeIn">
                <p className="text-sm text-muted-foreground">Sentimiento del Mercado: <span className={`font-bold ${getSentimentColor(market_sentiment || '')}`}>{market_sentiment}</span></p>
                <p className="text-slate-300 mt-2 leading-relaxed">{summary_text}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border p-5 rounded-lg text-center">
                        <h3 className="font-semibold text-card-foreground">{colcap_performance.index_name}</h3>
                        <p className="text-4xl font-bold text-slate-200 mt-2">{colcap_performance.value}</p>
                        <p className={`text-lg font-semibold ${getChangeColor(colcap_performance.change)}`}>
                            {colcap_performance.change} ({colcap_performance.change_percentage})
                        </p>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-card border border-border p-5 rounded-lg h-full">
                        <h3 className="font-semibold text-card-foreground mb-3">Acciones Clave</h3>
                        <div className="space-y-2">
                            {key_stocks.map((stock) => (
                                <div key={stock.ticker} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                                    <div>
                                        <p className="font-bold text-sm text-slate-200">{stock.ticker}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{stock.company_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm font-semibold text-slate-300">{stock.price}</p>
                                        <p className={`text-xs font-mono ${getChangeColor(stock.change_percentage)}`}>{stock.change_percentage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                 <h2 className="text-2xl font-bold text-slate-200 mb-4">Noticias de Colombia</h2>
                 <div className="bg-card border border-border p-5 rounded-lg">
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {news?.map((item, index) => (
                            <a href={item.uri} target="_blank" rel="noopener noreferrer" key={index} className="flex gap-4 items-start hover:bg-muted/50 p-2 rounded-md transition-colors">
                                {item.image_url ? 
                                    <img src={item.image_url} alt={item.title} className="h-20 w-20 object-cover rounded-md bg-muted shrink-0" />
                                    : <NewsPlaceholder />
                                }
                                <div className="flex-1">
                                    <p className="font-semibold text-md leading-tight text-slate-200">{item.title}</p>
                                    <p className="text-xs text-primary font-semibold mt-1">{item.source}</p>
                                    <p className="text-sm text-muted-foreground mt-2">{item.summary}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                 </div>
            </div>

        </div>
    );
};

export default LocalMarketView;