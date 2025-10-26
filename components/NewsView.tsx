import React from 'react';
import type { NewsArticle } from '../types';
import { useDataContext } from '../contexts/DataContext';

const NewsPlaceholder = () => (
    <div className="w-full h-40 flex items-center justify-center bg-muted rounded-t-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1 8h.01" />
        </svg>
    </div>
);

const NewsView: React.FC = () => {
    const { appData, refreshView, loadingStates } = useDataContext();
    const news = appData.news;
    const isLoading = loadingStates.news;
    
    const LoadingSkeleton = () => (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="w-full h-40 bg-muted"></div>
            <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="space-y-2 pt-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="p-6 overflow-y-auto h-full space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-200">Noticias del Mercado</h1>
                <button
                    onClick={() => refreshView('news')}
                    disabled={isLoading}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
                    </svg>
                    {isLoading ? 'Cargando...' : 'Refrescar'}
                </button>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading && !news
                    ? Array.from({ length: 12 }).map((_, i) => <LoadingSkeleton key={i} />)
                    : news?.map((item, index) => (
                        <a href={item.uri} target="_blank" rel="noopener noreferrer" key={index} 
                           className="bg-card border border-border rounded-lg overflow-hidden flex flex-col
                                      transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                            {item.image_url ? 
                                <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
                                : <NewsPlaceholder />
                            }
                            <div className="p-4 flex flex-col flex-grow">
                                <p className="font-bold text-md leading-tight flex-grow text-slate-200">{item.title}</p>
                                <p className="text-xs text-primary font-semibold mt-2">{item.source}</p>
                                <p className="text-sm text-muted-foreground mt-2">{item.summary}</p>
                            </div>
                        </a>
                    ))
                }
            </div>
            {!isLoading && (!news || news.length === 0) && (
                 <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground text-center border-2 border-dashed border-border rounded-lg">
                    <p>No se encontraron noticias en este momento.</p>
                </div>
            )}
        </div>
    );
};

export default NewsView;