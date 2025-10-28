import React, { useState } from 'react';
import type { Portfolio, PortfolioAsset, Chart } from '../types';
import { useDataContext } from '../contexts/DataContext';
import { getFinancialResponse } from '../services/geminiService';
import SpecificChart from './SpecificChart';

interface PortfolioViewProps {
  portfolioData?: Portfolio;
  isEmbeddedInChat?: boolean;
}

const PortfolioAssetCard: React.FC<{ asset: PortfolioAsset }> = ({ asset }) => (
    <div className="bg-background/60 border border-border rounded-lg p-4 transition-all hover:border-primary/50">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-md text-card-foreground">{asset.company_name}</h4>
                <p className="text-sm font-mono text-primary">{asset.ticker}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-card-foreground">{asset.allocation_percentage}%</p>
                <p className="text-xs text-muted-foreground">Asignación</p>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">{asset.rationale}</p>
    </div>
);

const StatCard: React.FC<{ title: string; value: string; description?: string }> = ({ title, value, description }) => (
    <div className="bg-background/60 border border-border/50 p-4 rounded-lg">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1 text-card-foreground">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
);

const PortfolioDetailView: React.FC<{ portfolio: Portfolio, onDelete?: (id: string) => void }> = ({ portfolio, onDelete }) => (
    <div className="bg-card border border-border rounded-xl p-6 animate-fadeIn">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-2xl font-bold text-card-foreground">{portfolio.strategy_name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Capital: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.total_capital)}</strong></span>
                    <span className="h-4 border-l border-border"></span>
                    <span>Riesgo: <strong>{portfolio.risk_level}</strong></span>
                    <span className="h-4 border-l border-border"></span>
                    <span>Horizonte: <strong>{portfolio.investment_horizon}</strong></span>
                </div>
            </div>
            {onDelete && (
                <button 
                    onClick={() => onDelete(portfolio.id)} 
                    className="text-muted-foreground hover:text-danger transition-colors p-2 rounded-full"
                    aria-label="Eliminar portafolio"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            )}
        </div>
        
        <p className="bg-background/50 p-4 rounded-md text-muted-foreground mb-6 text-sm">{portfolio.strategy_rationale}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            {portfolio.estimated_annual_return && (
                <StatCard title="Retorno Anual Estimado" value={portfolio.estimated_annual_return} />
            )}
            {portfolio.risk_analysis?.beta && (
                <StatCard title="Beta del Portafolio" value={portfolio.risk_analysis.beta} description="vs S&P 500" />
            )}
            {portfolio.risk_analysis?.standard_deviation && (
                <StatCard title="Desviación Estándar" value={portfolio.risk_analysis.standard_deviation} description="Volatilidad Anual" />
            )}
        </div>
        
        {portfolio.risk_analysis?.summary && (
            <div className="mb-6">
                <h4 className="font-semibold text-card-foreground mb-2">Análisis de Riesgo</h4>
                <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md">{portfolio.risk_analysis.summary}</p>
            </div>
        )}

        {portfolio.charts && portfolio.charts.length > 0 && (
            <div className="mb-6">
                <h4 className="font-semibold text-card-foreground mb-3">{portfolio.charts[0].title}</h4>
                <div className="bg-background/50 border border-border/50 p-2 rounded-lg h-96">
                    <SpecificChart chart={portfolio.charts[0]} />
                </div>
            </div>
        )}

        <h4 className="font-semibold text-card-foreground mb-3">Activos del Portafolio</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {portfolio.assets?.map((asset, index) => (
                <PortfolioAssetCard key={index} asset={asset} />
            ))}
        </div>
        {portfolio.conversational_response && <p className="text-sm text-center mt-6 text-muted-foreground italic">{portfolio.conversational_response}</p>}
    </div>
);

const CreatePortfolioForm: React.FC = () => {
    const { savePortfolio } = useDataContext();
    const [strategyName, setStrategyName] = useState('');
    const [totalCapital, setTotalCapital] = useState('10000');
    const [riskLevel, setRiskLevel] = useState('Moderado');
    const [investmentHorizon, setInvestmentHorizon] = useState('Largo Plazo');
    const [country, setCountry] = useState('EEUU');
    const [promptDetails, setPromptDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreatePortfolio = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const prompt = `Crea un portafolio de inversión con activos principalmente de ${country}, llamado "${strategyName || 'Estrategia Personalizada'}" con un capital total de $${totalCapital}, un nivel de riesgo ${riskLevel} y un horizonte de inversión a ${investmentHorizon}. Considera estas directivas adicionales: "${promptDetails || 'Enfócate en empresas líderes y ETFs diversificados.'}". Incluye un análisis de rendimiento histórico y de riesgo, además de un gráfico.`;

        try {
            const response = await getFinancialResponse(prompt);
            if (response.response_type === 'portfolio_creation' && response.portfolio_details) {
                const portfolioToSave = {
                    ...response.portfolio_details,
                    charts: response.charts,
                };
                savePortfolio(portfolioToSave, strategyName || response.portfolio_details.strategy_name);
                // Reset form
                setStrategyName('');
                setTotalCapital('10000');
                setRiskLevel('Moderado');
                setInvestmentHorizon('Largo Plazo');
                setCountry('EEUU');
                setPromptDetails('');
            } else {
                setError(response.conversational_response || "La IA no pudo generar un portafolio con esos criterios.");
            }
        } catch (err) {
            setError("Ocurrió un error al contactar a la IA. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card/80 border border-border rounded-xl p-5 h-full flex flex-col">
            <h3 className="text-lg font-bold text-card-foreground mb-4 flex-shrink-0">Crear Nuevo Portafolio</h3>
            <form onSubmit={handleCreatePortfolio} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Nombre del Portafolio</label>
                        <input id="name" type="text" value={strategyName} onChange={e => setStrategyName(e.target.value)} placeholder="Ej: Crecimiento Tecnológico" className="w-full bg-input text-sm p-2 rounded-md mt-1 focus:ring-primary focus:ring-1 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="country" className="text-xs font-semibold text-muted-foreground">País de Enfoque</label>
                        <select id="country" value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-input text-sm p-2 rounded-md mt-1 focus:ring-primary focus:ring-1 focus:outline-none">
                            <option>EEUU</option>
                            <option>Colombia</option>
                            <option>China</option>
                            <option>Japón</option>
                            <option>Europa</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="capital" className="text-xs font-semibold text-muted-foreground">Capital Total (USD)</label>
                        <input id="capital" type="number" value={totalCapital} onChange={e => setTotalCapital(e.target.value)} className="w-full bg-input text-sm p-2 rounded-md mt-1 focus:ring-primary focus:ring-1 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="risk" className="text-xs font-semibold text-muted-foreground">Nivel de Riesgo</label>
                        <select id="risk" value={riskLevel} onChange={e => setRiskLevel(e.target.value)} className="w-full bg-input text-sm p-2 rounded-md mt-1 focus:ring-primary focus:ring-1 focus:outline-none">
                            <option>Conservador</option>
                            <option>Moderado</option>
                            <option>Agresivo</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="horizon" className="text-xs font-semibold text-muted-foreground">Horizonte de Inversión</label>
                        <select id="horizon" value={investmentHorizon} onChange={e => setInvestmentHorizon(e.target.value)} className="w-full bg-input text-sm p-2 rounded-md mt-1 focus:ring-primary focus:ring-1 focus:outline-none">
                            <option>Corto Plazo</option>
                            <option>Mediano Plazo</option>
                            <option>Largo Plazo</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="details" className="text-xs font-semibold text-muted-foreground">Detalles Adicionales (Opcional)</label>
                        <textarea id="details" value={promptDetails} onChange={e => setPromptDetails(e.target.value)} rows={3} placeholder="Ej: Incluir acciones de IA y un ETF del S&P 500" className="w-full bg-input text-sm p-2 rounded-md mt-1 focus:ring-primary focus:ring-1 focus:outline-none"></textarea>
                    </div>
                </div>

                <div className="flex-shrink-0 mt-4">
                    {error && <p className="text-xs text-danger bg-danger/10 p-2 rounded-md mb-4">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Creando...' : 'Crear Portafolio con IA'}
                    </button>
                </div>
            </form>
        </div>
    );
};


const PortfolioView: React.FC<PortfolioViewProps> = ({ portfolioData, isEmbeddedInChat = false }) => {
  const { appData, deletePortfolio } = useDataContext();
  const { portfolios } = appData;
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

  if (isEmbeddedInChat && portfolioData) {
    return <PortfolioDetailView portfolio={portfolioData} />;
  }
  
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || (portfolios.length > 0 ? portfolios[0] : null);

  return (
    <div className="p-6 h-full flex flex-col">
        <header className="mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-card-foreground">Gestor de Portafolios</h2>
            <p className="text-muted-foreground">Crea, visualiza y gestiona tus estrategias de inversión.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
            <aside className="lg:col-span-1 h-full">
                <CreatePortfolioForm />
            </aside>
            <main className="lg:col-span-2 flex flex-col overflow-hidden">
                 {portfolios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full bg-card/50 border-2 border-dashed border-border rounded-xl text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="text-xl font-semibold text-card-foreground">No tienes portafolios guardados</h3>
                        <p className="text-muted-foreground mt-1">Usa el formulario de la izquierda para crear tu primera estrategia de inversión.</p>
                    </div>
                ) : (
                     <div className="flex flex-col gap-6 flex-1 overflow-hidden">
                        <div className="w-full bg-card/80 border border-border rounded-xl p-4 overflow-y-auto flex-shrink-0">
                            <h4 className="font-semibold mb-3 px-2 text-card-foreground">Mis Portafolios</h4>
                            <div className="space-y-2">
                                {portfolios.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPortfolioId(p.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedPortfolio?.id === p.id ? 'bg-primary/20 text-primary' : 'hover:bg-muted/50'}`}
                                    >
                                        <p className="font-semibold text-sm">{p.strategy_name}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {selectedPortfolio ? (
                                <PortfolioDetailView portfolio={selectedPortfolio} onDelete={deletePortfolio} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">Selecciona un portafolio para ver los detalles.</div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};

export default PortfolioView;