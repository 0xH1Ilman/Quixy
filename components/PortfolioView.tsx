import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Portfolio, Chart } from '../types';
import { getFinancialResponse } from '../services/geminiService';
import { useDataContext } from '../contexts/DataContext';
import SpecificChart from './SpecificChart';

const COLORS = ['#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

const PortfolioView: React.FC<{ portfolioData?: Portfolio; isEmbeddedInChat?: boolean; }> = ({ portfolioData, isEmbeddedInChat }) => {
    const { portfolios, savePortfolio, deletePortfolio } = useDataContext();
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [portfolioName, setPortfolioName] = useState('');
    const [capital, setCapital] = useState('10000');
    const [risk, setRisk] = useState<'Conservador' | 'Moderado' | 'Agresivo'>('Moderado');
    const [horizon, setHorizon] = useState<'Corto Plazo' | 'Mediano Plazo' | 'Largo Plazo'>('Largo Plazo');
    const [numStocks, setNumStocks] = useState('10');
    const [numEtfs, setNumEtfs] = useState('5');
    const [description, setDescription] = useState('Enfocado en crecimiento tecnológico y empresas con sólidos fundamentales.');

    if (isEmbeddedInChat && portfolioData) {
        return <PortfolioDetailView portfolio={portfolioData} isEmbeddedInChat={true} />;
    }

    const handleGeneratePortfolio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!portfolioName) {
            alert("Por favor, dale un nombre a tu portafolio.");
            return;
        }
        setIsLoading(true);
        const prompt = `Crea un portafolio de $${capital} con riesgo ${risk.toLowerCase()} para un horizonte de ${horizon.toLowerCase()}, compuesto por ${numStocks} acciones y ${numEtfs} ETFs. La estrategia debe estar enfocada en: ${description}. La suma de los porcentajes de asignación debe ser exactamente 100.`;
        try {
            const response = await getFinancialResponse(prompt);
            if (response.response_type === 'portfolio_creation' && response.portfolio_details) {
                savePortfolio(response.portfolio_details, portfolioName);
                setView('list');
                // Reset form
                setPortfolioName('');
                setCapital('10000');
            }
        } catch (error) {
            console.error("Failed to generate portfolio", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (selectedPortfolioId) {
        const portfolio = portfolios.find(p => p.id === selectedPortfolioId);
        return portfolio ? <PortfolioDetailView portfolio={portfolio} onBack={() => setSelectedPortfolioId(null)} onDelete={deletePortfolio} /> : null;
    }

    return (
        <div className="p-6 h-full overflow-y-auto">
            {view === 'list' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-slate-200">Gestor de Portafolios</h1>
                        <button onClick={() => setView('create')} className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors">
                            Crear Nuevo
                        </button>
                    </div>
                    {portfolios.length === 0 ? (
                        <p className="text-center text-muted-foreground mt-8">No tienes portafolios guardados. ¡Crea uno para empezar!</p>
                    ) : (
                        <div className="space-y-3">
                            {portfolios.map(p => (
                                <div key={p.id} onClick={() => setSelectedPortfolioId(p.id)} className="bg-card border border-border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <h2 className="font-bold text-lg text-slate-200">{p.strategy_name}</h2>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.total_capital)}</span>
                                        <span>{new Date(p.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {view === 'create' && (
                 <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('list')} className="text-muted-foreground hover:text-primary">&larr; Volver</button>
                            <h2 className="text-2xl font-bold text-slate-200">Crear Nuevo Portafolio</h2>
                        </div>
                        <div className="bg-card border border-border p-8 rounded-lg animate-fadeIn">
                             <form onSubmit={handleGeneratePortfolio} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300">Nombre del Portafolio</label>
                                    <input type="text" value={portfolioName} onChange={e => setPortfolioName(e.target.value)} placeholder="Ej: Mi Portafolio Tec." className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="text-sm font-medium text-slate-300">Capital (USD)</label>
                                        <input type="number" value={capital} onChange={e => setCapital(e.target.value)} placeholder="10000" className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-300">Nivel de Riesgo</label>
                                        <select value={risk} onChange={e => setRisk(e.target.value as any)} className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none">
                                            <option>Conservador</option>
                                            <option>Moderado</option>
                                            <option>Agresivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300">Nº de Acciones</label>
                                        <input type="number" value={numStocks} onChange={e => setNumStocks(e.target.value)} placeholder="10" className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none" />
                                    </div>
                                     <div>
                                        <label className="text-sm font-medium text-slate-300">Nº de ETFs</label>
                                        <input type="number" value={numEtfs} onChange={e => setNumEtfs(e.target.value)} placeholder="5" className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300">Horizonte Temporal</label>
                                    <select value={horizon} onChange={e => setHorizon(e.target.value as any)} className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none">
                                        <option>Corto Plazo</option>
                                        <option>Mediano Plazo</option>
                                        <option>Largo Plazo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300">Descripción de la Estrategia</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full bg-input text-foreground rounded-md p-2 border border-border focus:ring-2 focus:ring-primary focus:outline-none" />
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50">
                                    {isLoading ? 'Generando...' : 'Generar Portafolio'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PortfolioDetailView: React.FC<{portfolio: Portfolio, onBack?: () => void, onDelete?: (id: string) => void, isEmbeddedInChat?: boolean}> = ({ portfolio, onBack, onDelete, isEmbeddedInChat = false }) => {
    const [performanceCharts, setPerformanceCharts] = useState<Chart[] | null>(null);
    const [isChartsLoading, setIsChartsLoading] = useState(true);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            if (!portfolio.assets || portfolio.assets.length === 0) {
                setIsChartsLoading(false);
                return;
            }

            setIsChartsLoading(true);
            setPerformanceCharts(null);
            const assetsString = portfolio.assets.map(a => `${a.ticker}: ${a.allocation_percentage}%`).join(', ');
            const prompt = `Dado un portafolio con los siguientes activos y asignaciones: ${assetsString}. 
            Por favor, genera dos gráficos basados en datos reales y estimaciones razonables:
            1.  Un gráfico de líneas titulado "Crecimiento Histórico (1A)" que muestre el rendimiento ponderado de este portafolio durante el último año. Utiliza datos históricos reales para cada activo. El 'dataKey' debe ser 'Crecimiento' y el color '#3b82f6'.
            2.  Un gráfico de barras titulado "CAGR Estimado" que muestre la Tasa de Crecimiento Anual Compuesta estimada para los próximos 5, 10 y 15 años. El 'dataKey' debe ser 'CAGR' y el color '#6B7280'.
            Responde únicamente con un objeto JSON que contenga un array llamado "charts" con los dos gráficos solicitados.`;

            try {
                const response = await getFinancialResponse(prompt);
                if (response.charts && response.charts.length > 0) {
                    setPerformanceCharts(response.charts);
                }
            } catch (error) {
                console.error("Failed to fetch portfolio performance charts", error);
            } finally {
                setIsChartsLoading(false);
            }
        };

        fetchPerformanceData();
    }, [portfolio]);
   
    const handleExport = () => {
        let textContent = `Estrategia de Portafolio: ${portfolio.strategy_name}\n\n`;
        textContent += `Capital Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.total_capital)}\n`;
        textContent += `Nivel de Riesgo: ${portfolio.risk_level}\n`;
        textContent += `Horizonte de Inversión: ${portfolio.investment_horizon}\n\n`;
        textContent += `Justificación de la Estrategia:\n${portfolio.strategy_rationale}\n\n`;
        textContent += "Activos del Portafolio:\n";
        portfolio.assets?.forEach(asset => {
            textContent += `- ${asset.company_name} (${asset.ticker}): ${asset.allocation_percentage}%\n`;
            textContent += `  Justificación: ${asset.rationale}\n`;
        });
        
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portafolio_${portfolio.strategy_name.replace(/\s/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = () => {
        if (onDelete && window.confirm(`¿Estás seguro de que quieres eliminar el portafolio "${portfolio.strategy_name}"?`)) {
            onDelete(portfolio.id);
        }
    }

    const chartData = portfolio.assets?.map(asset => ({
        name: asset.ticker,
        value: asset.allocation_percentage
    })) || [];
  
    const CustomTooltipContent = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-popover text-popover-foreground p-2 border border-border rounded-md shadow-lg">
            <p className="font-bold">{`${data.name}: ${data.value.toFixed(2)}%`}</p>
            </div>
        );
        }
        return null;
    };

    const containerPadding = isEmbeddedInChat ? 'p-0' : 'p-6';
    
    return (
        <div className={`space-y-4 ${containerPadding} overflow-y-auto h-full`}>
            {!isEmbeddedInChat && onBack && (
                 <div className="flex justify-between items-center">
                    <button onClick={onBack} className="text-muted-foreground hover:text-primary flex items-center gap-2">&larr; Volver al Gestor</button>
                    <div className="flex gap-2">
                        <button onClick={handleExport} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Exportar
                        </button>
                         <button onClick={handleDelete} className="text-xs font-medium text-muted-foreground hover:text-danger transition-colors flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Eliminar
                        </button>
                    </div>
                 </div>
            )}
            {portfolio.conversational_response && <p className="text-lg text-slate-300">{portfolio.conversational_response}</p>}
            
            <div className="bg-card border border-border p-5 rounded-lg">
                <h2 className="text-2xl font-bold mb-2 text-card-foreground">{portfolio.strategy_name}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                    <span><strong>Capital:</strong> <span className="text-slate-300">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.total_capital)}</span></span>
                    <span><strong>Riesgo:</strong> <span className="text-slate-300">{portfolio.risk_level}</span></span>
                    <span><strong>Horizonte:</strong> <span className="text-slate-300">{portfolio.investment_horizon}</span></span>
                </div>
                
                <p className="text-slate-300 mb-6 leading-relaxed">{portfolio.strategy_rationale}</p>
                
                <div className="grid lg:grid-cols-5 gap-6 items-start">
                    <div className="lg:col-span-2 bg-background/50 border border-border/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-card-foreground text-center">Asignación de Activos</h3>
                        <div className="w-full h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} fill="#8884d8" paddingAngle={2} dataKey="value" nameKey="name">
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={'var(--card)'} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltipContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Activos del Portafolio</h3>
                        <div className="space-y-3">
                            {portfolio.assets?.map((asset, index) => (
                                <div key={index} className="bg-background/50 border border-border/50 p-3 rounded-md">
                                    <div className="flex justify-between items-center font-bold">
                                        <span className="text-slate-200">{asset.company_name} ({asset.ticker})</span>
                                        <span className="text-primary">{asset.allocation_percentage}%</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{asset.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                    <h3 className="text-lg font-semibold mb-4 text-card-foreground">Análisis de Rendimiento</h3>
                    {isChartsLoading ? (
                        <div className="flex items-center justify-center h-48 text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Calculando rendimiento histórico y proyecciones...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-6">
                            {performanceCharts && performanceCharts.length > 0 ? (
                                performanceCharts.map((chart, index) => (
                                    <div key={index} className="bg-background/50 border border-border/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-card-foreground mb-3 text-center">{chart.title}</h4>
                                        <div className="h-80">
                                            <SpecificChart chart={chart} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="xl:col-span-2 text-center p-8 text-muted-foreground">
                                    No se pudo cargar el análisis de rendimiento para este portafolio.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PortfolioView;
