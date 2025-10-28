import React, { useEffect } from 'react';
import type { CommoditiesForexResponse, Commodity, ForexPair } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface CommoditiesForexViewProps {
    isEmbeddedInChat?: boolean;
}

const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-success';
    if (change.startsWith('-')) return 'text-danger';
    return 'text-muted-foreground';
};

const CommodityIcon: React.FC<{ name: string }> = ({ name }) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('oro') || lowerName.includes('gold')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.7 5.4m7-10h-2.553a2 2 0 00-1.736 1.03l-2.7 5.4m0 0L7 20m7-10h2.553a2 2 0 011.736 1.03l2.7 5.4" /></svg>;
    }
    if (lowerName.includes('plata') || lowerName.includes('silver')) {
         return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
    }
    if (lowerName.includes('petróleo') || lowerName.includes('oil')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
};

const ForexIcon: React.FC<{ pair: string }> = ({ pair }) => {
    const currencies = pair.split('/');
    if (currencies.length < 2) return null;
    const [base, quote] = currencies;

    // A simple way to generate initials for flags
    return (
        <div className="flex -space-x-2 items-center">
            <div className="h-6 w-6 rounded-full bg-blue-800 flex items-center justify-center text-xs font-bold text-white border-2 border-card z-10">{base.substring(0,2)}</div>
            <div className="h-6 w-6 rounded-full bg-red-800 flex items-center justify-center text-xs font-bold text-white border-2 border-card">{quote.substring(0,2)}</div>
        </div>
    );
}

const CommodityCard: React.FC<{ item: Commodity }> = ({ item }) => (
    <div className="bg-card/80 border border-border p-4 rounded-lg flex items-center gap-4">
        <div className="p-2 bg-background rounded-lg"><CommodityIcon name={item.name} /></div>
        <div className="flex-1">
            <p className="font-bold text-card-foreground text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.unit}</p>
        </div>
        <div className="text-right">
            <p className="text-md font-mono font-semibold text-card-foreground">{item.price}</p>
            <p className={`text-sm font-mono ${getChangeColor(item.change_percentage)}`}>
                {item.change} ({item.change_percentage})
            </p>
        </div>
    </div>
);

const ForexCard: React.FC<{ item: ForexPair }> = ({ item }) => (
    <div className="bg-card/80 border border-border p-4 rounded-lg flex items-center gap-4">
        <ForexIcon pair={item.pair} />
        <div className="flex-1">
            <p className="font-bold text-card-foreground text-sm">{item.pair}</p>
        </div>
        <div className="text-right">
            <p className="text-md font-mono font-semibold text-card-foreground">{item.rate}</p>
            <p className={`text-sm font-mono ${getChangeColor(item.change_percentage)}`}>
                {item.change} ({item.change_percentage})
            </p>
        </div>
    </div>
);

const CommoditiesForexContent: React.FC<{ data: CommoditiesForexResponse }> = ({ data }) => (
    <div className="space-y-6 animate-fadeIn">
        {data.conversational_response && <p className="text-lg text-muted-foreground px-1">{data.conversational_response}</p>}
        {data.summary && (
             <div className="bg-card border border-border p-5 rounded-xl">
                <p className="text-muted-foreground text-sm">{data.summary}</p>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Materias Primas</h3>
                <div className="space-y-3">
                    {data.commodities?.map((item, index) => <CommodityCard key={index} item={item} />)}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Divisas (Forex)</h3>
                <div className="space-y-3">
                    {data.forex_pairs?.map((item, index) => <ForexCard key={index} item={item} />)}
                </div>
            </div>
        </div>
    </div>
);

const CommoditiesForexView: React.FC<CommoditiesForexViewProps> = ({ isEmbeddedInChat = false }) => {
    const { appData, loadingStates, refreshView } = useDataContext();
    const data = appData.commoditiesForex;
    const isLoading = loadingStates.commodities_forex;

    useEffect(() => {
        if (!isEmbeddedInChat && !data) {
            refreshView('commodities_forex');
        }
    }, [isEmbeddedInChat, data, refreshView]);
    
    const handleRefresh = () => {
        refreshView('commodities_forex');
    };

    if (isLoading && !data) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando datos de materias primas y divisas...</div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos disponibles.</div>;
    }

    if (isEmbeddedInChat) {
        return <CommoditiesForexContent data={data} />;
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-card-foreground">Materias Primas y Divisas</h2>
                    <p className="text-muted-foreground">Cotizaciones en tiempo real de los mercados de commodities y forex.</p>
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
            <CommoditiesForexContent data={data} />
        </div>
    );
};

export default CommoditiesForexView;