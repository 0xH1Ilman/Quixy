import React, { useEffect } from 'react';
import type { EconomicIndicatorsResponse, EconomicIndicator } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface EconomicIndicatorsViewProps {
    isEmbeddedInChat?: boolean;
}

const getTrendIcon = (trend: 'Subiendo' | 'Bajando' | 'Estable') => {
    switch (trend) {
        case 'Subiendo':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
        case 'Bajando':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" /></svg>;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>;
    }
};

const IndicatorCard: React.FC<{ indicator: EconomicIndicator }> = ({ indicator }) => (
    <div className="bg-card/80 border border-border p-5 rounded-xl">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-card-foreground">{indicator.name}</h3>
                <p className="text-sm text-muted-foreground">{indicator.period}</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-primary">{indicator.value}</p>
                {getTrendIcon(indicator.trend)}
            </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border/50">{indicator.interpretation}</p>
    </div>
);


const EconomicIndicatorsContent: React.FC<{ data: EconomicIndicatorsResponse }> = ({ data }) => (
    <div className="space-y-6 animate-fadeIn">
        {data.conversational_response && <p className="text-lg text-muted-foreground px-1">{data.conversational_response}</p>}
        {data.summary && (
             <div className="bg-card border border-border p-5 rounded-xl">
                <p className="text-muted-foreground text-sm">{data.summary}</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.indicators?.map((indicator, index) => (
                <IndicatorCard key={index} indicator={indicator} />
            ))}
        </div>
    </div>
);


const EconomicIndicatorsView: React.FC<EconomicIndicatorsViewProps> = ({ isEmbeddedInChat = false }) => {
    const { appData, loadingStates, refreshView } = useDataContext();
    const data = appData.economicIndicators;
    const isLoading = loadingStates.indicators;

    useEffect(() => {
        if (!isEmbeddedInChat && !data) {
            refreshView('indicators');
        }
    }, [isEmbeddedInChat, data, refreshView]);

    const handleRefresh = () => {
        refreshView('indicators');
    };

    if (isLoading && !data) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando indicadores económicos...</div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos de indicadores económicos.</div>;
    }

    if (isEmbeddedInChat) {
        return <EconomicIndicatorsContent data={data} />;
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-card-foreground">Indicadores Económicos Clave</h2>
                    <p className="text-muted-foreground">Perspectivas macroeconómicas que mueven los mercados.</p>
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
            <EconomicIndicatorsContent data={data} />
        </div>
    );
};

export default EconomicIndicatorsView;