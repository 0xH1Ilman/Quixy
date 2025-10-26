import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import type { Message, Portfolio, MarketSummary, SectorPerformanceResponse, EconomicIndicatorsResponse, ApiResponse, IndexPerformance, NewsArticle, LocalMarketResponse } from '../types';
import { getFinancialResponse } from '../services/geminiService';

interface AppData {
    chatHistory: Message[];
    portfolios: Portfolio[];
    marketSummary: MarketSummary | null;
    indexPerformance: IndexPerformance[] | null;
    sectorPerformance: SectorPerformanceResponse | null;
    economicIndicators: EconomicIndicatorsResponse | null;
    news: NewsArticle[] | null;
    localMarket: LocalMarketResponse | null;
}

interface LoadingStates {
    market: boolean;
    ticker: boolean;
    sectors: boolean;
    indicators: boolean;
    news: boolean;
    local_market: boolean;
}

interface DataContextType {
    appData: AppData;
    setAppData: React.Dispatch<React.SetStateAction<AppData>>;
    chatHistory: Message[];
    setChatHistory: (messages: Message[]) => void;
    portfolios: Portfolio[];
    savePortfolio: (portfolio: Omit<Portfolio, 'id' | 'created_at'>, name: string) => void;
    deletePortfolio: (id: string) => void;
    refreshView: (view: 'market' | 'sectors' | 'indicators' | 'news' | 'local_market') => Promise<void>;
    loadingStates: LoadingStates;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialAppData: AppData = {
    chatHistory: [
        {
            sender: 'bot',
            analysis: {
                response_type: 'general_text',
                conversational_response: "¡Hola! Soy Quixy, tu asistente financiero. ¿Cómo puedo ayudarte hoy? Puedes preguntar sobre una acción como '¿Cómo está TSLA?' o 'Dame un análisis de Apple'. También puedes pedirme que cree un portafolio o que busque acciones por ti.",
            }
        },
    ],
    portfolios: [],
    marketSummary: null,
    indexPerformance: null,
    sectorPerformance: null,
    economicIndicators: null,
    news: null,
    localMarket: null,
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appData, setAppData] = useState<AppData>(() => {
        try {
            const savedData = localStorage.getItem('quixyAppData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // Ensure chat history is not empty
                if (!parsed.chatHistory || parsed.chatHistory.length === 0) {
                    parsed.chatHistory = initialAppData.chatHistory;
                }
                return { ...initialAppData, ...parsed };
            }
        } catch (error) {
            console.error("Failed to parse app data from localStorage", error);
        }
        return initialAppData;
    });

    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        market: false,
        ticker: false,
        sectors: false,
        indicators: false,
        news: false,
        local_market: false,
    });
    
    useEffect(() => {
        localStorage.setItem('quixyAppData', JSON.stringify(appData));
    }, [appData]);

    const fetchTickerData = useCallback(async () => {
        // Fetches only if not already loaded
        if (appData.indexPerformance) return;
        setLoadingStates(prev => ({ ...prev, ticker: true }));
        try {
            const prompt = "Dame el estado actual de los índices S&P 500, NASDAQ, Dow Jones, COLCAP y los tickers BTC, ARKK, TQQQ, ASML, NVDA, GOOGL, EC, AAPL, JPM, y las 10 acciones estadounidenses más grandes.";
            const res = await getFinancialResponse(prompt);
            if (res.response_type === 'market_summary' && res.market_summary?.index_performance) {
                setAppData(prev => ({...prev, indexPerformance: res.market_summary.index_performance}));
            }
        } catch (error) {
             console.error(`Failed to refresh ticker:`, error);
        } finally {
            setLoadingStates(prev => ({ ...prev, ticker: false }));
        }
    }, [appData.indexPerformance]);

    const refreshView = useCallback(async (view: 'market' | 'sectors' | 'indicators' | 'news' | 'local_market') => {
        setLoadingStates(prev => ({ ...prev, [view]: true }));
        try {
            let prompt = '';
            let response_type: ApiResponse['response_type'] = 'market_summary';
            let dataKey: keyof AppData = 'marketSummary';
            
            switch(view) {
                case 'market':
                    prompt = "Dame un resumen del mercado de hoy.";
                    response_type = 'market_summary';
                    dataKey = 'marketSummary';
                    break;
                case 'sectors':
                    prompt = "Dame el rendimiento de los sectores del S&P 500 en la última semana.";
                    response_type = 'sector_performance';
                    dataKey = 'sectorPerformance';
                    break;
                case 'indicators':
                    prompt = "Dame los principales indicadores económicos de Estados Unidos (inflación, desempleo, tasas de interés, etc.)";
                    response_type = 'economic_indicators';
                    dataKey = 'economicIndicators';
                    break;
                case 'news':
                    prompt = "Dame las 20 noticias financieras más importantes del día, incluyendo resúmenes e imágenes si están disponibles.";
                    response_type = 'news';
                    dataKey = 'news';
                    break;
                case 'local_market':
                    prompt = "Dame un resumen completo del mercado de valores de Colombia, incluyendo el sentimiento actual, un análisis del índice COLCAP, las acciones más importantes como Ecopetrol y Bancolombia, y las últimas noticias financieras del país de fuentes como La República o Portafolio.";
                    response_type = 'local_market_summary';
                    dataKey = 'localMarket';
                    break;
            }

            const response = await getFinancialResponse(prompt);
            
            let responseData: any = null;
            if (response.response_type === response_type) {
                if (view === 'news') {
                    responseData = response.news;
                } else {
                     responseData = response[response_type as keyof Omit<ApiResponse, 'response_type' | 'conversational_response' | 'news'>];
                }
            }

            if (responseData) {
                setAppData(prev => ({ ...prev, [dataKey]: responseData as any }));
            }
        } catch (error) {
            console.error(`Failed to refresh ${view}:`, error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [view]: false }));
        }
    }, []);

    useEffect(() => {
        const loadInitialData = () => {
            fetchTickerData();
            if (!appData.marketSummary) refreshView('market');
            if (!appData.sectorPerformance) refreshView('sectors');
            if (!appData.economicIndicators) refreshView('indicators');
            if (!appData.news) refreshView('news');
            if (!appData.localMarket) refreshView('local_market');
        };
        loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs only once on initial load

    const setChatHistory = (messages: Message[]) => {
        setAppData(prev => ({...prev, chatHistory: messages}));
    };

    const savePortfolio = (portfolio: Omit<Portfolio, 'id' | 'created_at'>, name: string) => {
        const newPortfolio: Portfolio = {
            ...portfolio,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            strategy_name: name || portfolio.strategy_name,
        };
        setAppData(prev => ({...prev, portfolios: [...prev.portfolios, newPortfolio]}));
    };

    const deletePortfolio = (id: string) => {
        setAppData(prev => ({...prev, portfolios: prev.portfolios.filter(p => p.id !== id)}));
    };

    const value = useMemo(() => ({
        appData,
        setAppData,
        chatHistory: appData.chatHistory,
        setChatHistory,
        portfolios: appData.portfolios,
        savePortfolio,
        deletePortfolio,
        refreshView,
        loadingStates,
    }), [appData, loadingStates, refreshView]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};