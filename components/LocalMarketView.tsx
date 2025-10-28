import React, { useEffect } from 'react';
import type { LocalMarketResponse, LocalMarketMover, IndexPerformance, NewsArticle } from '../types';
import { useDataContext } from '../contexts/DataContext';

const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-success';
    if (change.startsWith('-')) return 'text-danger';
    return 'text-muted-foreground';
};

const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
        case 'positivo': return 'bg-success/20 text-success';
        case 'negativo': return 'bg-danger/20 text-danger';
        default: return 'bg-yellow-400/20 text-yellow-400';
    }
};

const ColcapCard: React.FC<{ data: IndexPerformance }> = ({ data }) => (
    <div className="bg-card/80 border border-border/80 p-6 rounded-xl text-center">
        <p className="text-lg font-semibold text-primary">{data.index_name}</p>
        <p className="text-5xl font-bold mt-2 text-card-foreground">{data.value}</p>
        <p className={`text-xl font-semibold mt-2 ${getChangeColor(data.change_percentage)}`}>
            {data.change} ({data.change_percentage})
        </p>
    </div>
);

const KeyStockCard: React.FC<{ stock: LocalMarketMover }> = ({ stock }) => (
    <div className="bg-background/60 p-4 rounded-lg border border-border/50 flex justify-between items-center">
        <div>
            <p className="font-bold text-card-foreground">{stock.company_name}</p>
            <p className="text-sm font-mono text-primary">{stock.ticker}</p>
        </div>
        <div className="text-right">
            <p className="font-mono font-semibold text-card-foreground">{stock.price}</p>
            <p className={`font-mono text-sm ${getChangeColor(stock.change_percentage)}`}>{stock.change_percentage}</p>
        </div>
    </div>
);

const ArticleItem: React.FC<{ article: NewsArticle }> = ({ article }) => (
      <a href={article.uri} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <p className="font-semibold text-primary text-sm">{article.title}</p>
          <p className="text-xs text-muted-foreground">{article.source}</p>
      </a>
);

const LocalMarketView: React.FC = () => {
    const { appData, loadingStates, refreshView } = useDataContext();
    const data = appData.localMarket;
    const isLoading = loadingStates.local_market;
    
    useEffect(() => {
        if (!data) {
            refreshView('local_market');
        }
    }, [data, refreshView]);

    const handleRefresh = () => {
        refreshView('local_market');
    };

    if (isLoading && !data) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando resumen del mercado local...</div>;
    }

    if (!data?.summary) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos del mercado local disponibles.</div>;
    }

    const { summary } = data;

    return (
        <div className="p-6">
             <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-card-foreground">Mercado Local (Colombia)</h2>
                    <p className="text-muted-foreground">Análisis enfocado en el mercado de valores colombiano.</p>
                </div>
                 <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="bg-secondary text-secondary-foreground hover:bg-muted px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
                    {isLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
            </header>
            
            <div className="space-y-6 animate-fadeIn">
                 {data.conversational_response && <p className="text-lg text-muted-foreground px-1">{data.conversational_response}</p>}
                
                <div className="bg-card border border-border p-5 rounded-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-card-foreground">Sentimiento del Mercado</h3>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getSentimentColor(summary.market_sentiment)}`}>
                            {summary.market_sentiment}
                        </span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">{summary.summary_text}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ColcapCard data={summary.colcap_performance} />
                    </div>
                    <div className="lg:col-span-2 bg-card/80 border border-border p-5 rounded-xl">
                        <h3 className="font-bold mb-4 text-card-foreground">Acciones Clave</h3>
                        <div className="space-y-3">
                            {summary.key_stocks.map(stock => <KeyStockCard key={stock.ticker} stock={stock} />)}
                        </div>
                    </div>
                </div>

                {summary.news && summary.news.length > 0 && (
                     <div className="bg-card border border-border p-5 rounded-xl">
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground">Noticias Locales Relevantes</h3>
                        <div className="space-y-1 max-h-80 overflow-y-auto">
                            {summary.news.map((item, index) => <ArticleItem key={index} article={item} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocalMarketView;