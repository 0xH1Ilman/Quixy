import React, { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';
import { getFinancialResponse } from '../services/geminiService';
import ThemeSwitcher from './ThemeSwitcher';
import IndexTicker from './IndexTicker';
import BrandLogo from './QuixyLogo';

type View = 'chat' | 'portfolio' | 'market' | 'charts' | 'indicators' | 'commodities_forex' | 'screener' | 'news';

interface DashboardHomeViewProps {
  onSetView: (view: View | 'home', params?: { ticker?: string }) => void;
}

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string, onClick?: () => void}> = ({ icon, title, description, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-card/50 border border-border rounded-xl p-5 flex items-start gap-4 h-full
            transition-all duration-300 ease-in-out transform hover:bg-card hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
        >
            <div className="text-primary bg-primary/10 p-3 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-md font-bold text-card-foreground mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
        </div>
    );
};

const RealTimeNews: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const NewsPlaceholder = () => (
      <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-lg shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1 8h.01" />
          </svg>
      </div>
    );

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getFinancialResponse("Dame las 5 noticias financieras más importantes del día.");
                if (response.response_type === 'market_summary' && response.market_summary?.news) {
                    setNews(response.market_summary.news);
                } else if (response.news) {
                    setNews(response.news);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="bg-card/80 border border-border rounded-xl p-6 h-full">
            <h3 className="text-xl font-bold text-card-foreground mb-4">Noticias Clave</h3>
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="h-16 w-16 bg-muted rounded-lg"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {news?.slice(0, 4).map((item, index) => (
                        <a href={item.uri} target="_blank" rel="noopener noreferrer" key={index} className="flex gap-4 items-center hover:bg-muted/50 p-2 rounded-lg transition-colors">
                             <NewsPlaceholder />
                            <div className="flex-1">
                                <p className="font-semibold text-sm leading-tight text-card-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.source}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({ onSetView }) => {
  const [ticker, setTicker] = useState('');

  const handleStockSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(ticker.trim()){
          onSetView('charts', { ticker: ticker.trim().toUpperCase() });
      }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground animate-fadeIn">
        <header className="flex justify-between items-center p-6 lg:p-8 pb-4">
             <div className="flex items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold tracking-wide text-card-foreground">
                    BrightStone Finance
                </h1>
            </div>
            <ThemeSwitcher />
        </header>

        <IndexTicker />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <div className="animate-slideUpAndFadeIn">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-card-foreground mb-3 leading-tight">Tu Centro de Mando Financiero</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl">
                                Obtén análisis profundos, crea portafolios y navega el mercado con una IA de precisión institucional.
                            </p>
                        </div>

                        <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-2xl shadow-primary/5 animate-slideUpAndFadeIn" style={{animationDelay: '100ms'}}>
                            <h3 className="font-bold text-lg text-card-foreground mb-3">Análisis Instantáneo de Activos</h3>
                             <form onSubmit={handleStockSearch} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value)}
                                    placeholder="Buscar un símbolo... Ej: AAPL, TSLA, NVDA"
                                    className="w-full bg-input text-foreground rounded-lg p-3 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                />
                                <button type="submit" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors">
                                    Analizar
                                </button>
                            </form>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="animate-slideUpAndFadeIn" style={{animationDelay: '200ms'}}>
                                <FeatureCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                                    title="Pregúntale a Quixy"
                                    description="Explora y obtén respuestas complejas basadas en datos de mercado en tiempo real."
                                    onClick={() => onSetView('chat')}
                                />
                            </div>
                             <div className="animate-slideUpAndFadeIn" style={{animationDelay: '300ms'}}>
                                 <FeatureCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                                    title="Carteras Inteligentes"
                                    description="Diseña y gestiona portafolios de inversión diversificados y a tu medida."
                                    onClick={() => onSetView('portfolio')}
                                />
                            </div>
                             <div className="animate-slideUpAndFadeIn" style={{animationDelay: '400ms'}}>
                                <FeatureCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                                    title="Pulso del Mercado"
                                    description="Un resumen completo con índices, sentimiento y los mayores movimientos del día."
                                    onClick={() => onSetView('market')}
                                />
                            </div>
                            <div className="animate-slideUpAndFadeIn" style={{animationDelay: '500ms'}}>
                                <FeatureCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>}
                                    title="Buscador de Acciones IA"
                                    description="Encuentra oportunidades de inversión usando criterios en lenguaje natural."
                                    onClick={() => onSetView('screener')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 animate-slideUpAndFadeIn" style={{animationDelay: '250ms'}}>
                        <RealTimeNews />
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default DashboardHomeView;