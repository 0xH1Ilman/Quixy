import React, { useEffect } from 'react';
import type { NewsArticle } from '../types';
import { useDataContext } from '../contexts/DataContext';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <a href={article.uri} target="_blank" rel="noopener noreferrer" className="bg-card/80 border border-border rounded-xl p-5 flex flex-col md:flex-row items-start gap-5 hover:bg-card transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
        <div className="w-full md:w-48 h-32 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center">
            {article.image_url ? (
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1 8h.01" />
                </svg>
            )}
        </div>
        <div>
            <p className="text-xs text-primary font-semibold mb-1">{article.source}</p>
            <h3 className="text-lg font-bold mb-2 text-card-foreground">{article.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{article.summary}</p>
        </div>
    </a>
);


const NewsView: React.FC = () => {
    const { appData, loadingStates, refreshView } = useDataContext();
    const news = appData.news;
    const isLoading = loadingStates.news;

    useEffect(() => {
        if (!news) {
            refreshView('news');
        }
    }, [news, refreshView]);
    
    const handleRefresh = () => {
        refreshView('news');
    };

    const Skeletons = () => (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card/80 border border-border rounded-xl p-5 flex flex-col md:flex-row items-start gap-5 animate-pulse">
                    <div className="w-full md:w-48 h-32 flex-shrink-0 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                        <div className="h-5 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-card-foreground">Noticias Financieras</h2>
                    <p className="text-muted-foreground">Las últimas noticias que impactan el mercado global.</p>
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
            <div className="space-y-4">
                {isLoading && !news ? (
                   <Skeletons />
                ) : (
                    news?.map((article, index) => <NewsCard key={index} article={article} />)
                )}
                {!isLoading && (!news || news.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">No se encontraron noticias.</div>
                )}
            </div>
        </div>
    );
};

export default NewsView;