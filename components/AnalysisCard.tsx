import React from 'react';
import type { ApiResponse, KeyMetric, WebSource, NewsArticle } from '../types';
import SpecificChart from './SpecificChart';

interface AnalysisCardProps {
  analysis: ApiResponse;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const { stock_analysis, charts, news, sources, conversational_response } = analysis;

  if (!stock_analysis) {
    return (
      <div className="bg-card p-4 rounded-lg text-card-foreground">
        <p>{conversational_response || "No se encontró análisis de la acción."}</p>
      </div>
    );
  }

  const {
    company_name,
    ticker,
    current_price,
    price_change,
    change_percentage,
    recommendation,
    price_target,
    summary,
    market_sentiment,
    key_metrics,
  } = stock_analysis;
  
  const parseToFloat = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const num_current_price = parseToFloat(current_price);
  const num_price_change = parseToFloat(price_change);
  const num_change_percentage = parseToFloat(change_percentage);
  const num_price_target = parseToFloat(price_target);

  const isPositiveChange = num_price_change >= 0;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positivo':
      case 'alcista':
        return 'text-success';
      case 'negativo':
      case 'bajista':
        return 'text-danger';
      default:
        return 'text-yellow-400';
    }
  };
  
  const getRecommendationColor = (rec: string) => {
    switch (rec?.toLowerCase()) {
      case 'buy':
        return 'bg-success/20 text-success';
      case 'sell':
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-yellow-400/20 text-yellow-400';
    }
  };

  const KeyMetricCard: React.FC<{ metric: KeyMetric }> = ({ metric }) => (
    <div className="bg-background/50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-muted-foreground">{metric.name}</h4>
        <p className="text-lg font-bold text-card-foreground">{metric.value}</p>
      </div>
      <p className="text-xs text-muted-foreground/70">{metric.explanation}</p>
    </div>
  );
  
  const ArticleItem: React.FC<{ article: WebSource | NewsArticle }> = ({ article }) => (
      <a href={article.uri} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <p className="font-semibold text-primary text-sm truncate">{article.title}</p>
          <p className="text-xs text-muted-foreground">{new URL(article.uri).hostname}</p>
      </a>
  );

  return (
    <div className="space-y-6">
      {conversational_response && <p className="text-lg px-1 text-muted-foreground">{conversational_response}</p>}
      
      {/* Header */}
      <div className="bg-card border border-border p-5 rounded-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-card-foreground">{company_name} ({ticker})</h2>
            <div className="flex items-baseline space-x-3 mt-1">
              <p className="text-4xl font-light text-card-foreground">
                ${num_current_price.toFixed(2)}
              </p>
              <p className={`text-xl font-semibold ${isPositiveChange ? 'text-success' : 'text-danger'}`}>
                {isPositiveChange ? '+' : ''}{num_price_change.toFixed(2)} ({isPositiveChange ? '+' : ''}{num_change_percentage.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 pl-4">
             <p className={`text-sm font-bold px-3 py-1 rounded-full ${getRecommendationColor(recommendation)}`}>{recommendation}</p>
             <p className="text-sm text-muted-foreground mt-2">Price Target: <span className="font-bold text-card-foreground">${num_price_target.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      {/* Summary and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card border border-border p-5 rounded-xl flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Análisis Fundamental</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">{summary}</p>
            <div className="mt-auto border-t border-border/50 pt-3">
                 <p className="text-sm text-muted-foreground">Sentimiento del Mercado: <span className={`font-bold ${getSentimentColor(market_sentiment)}`}>{market_sentiment}</span></p>
            </div>
        </div>
        <div className="lg:col-span-2 bg-card border border-border p-4 rounded-xl">
          {charts && charts.length > 0 ? (
            <div className="w-full h-96">
              <SpecificChart chart={charts[0]} />
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos de gráfico disponibles.</div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      {key_metrics && key_metrics.length > 0 && (
         <div className="bg-card border border-border p-5 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">Métricas Clave</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {key_metrics.map((metric, index) => <KeyMetricCard key={index} metric={metric} />)}
            </div>
        </div>
      )}

      {/* News and Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(news && news.length > 0) && (
             <div className="bg-card border border-border p-5 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Noticias Relevantes</h3>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                    {news.map((item, index) => <ArticleItem key={index} article={item} />)}
                </div>
            </div>
        )}
        {(sources && sources.length > 0) && (
            <div className="bg-card border border-border p-5 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Fuentes de Datos</h3>
                 <div className="space-y-1 max-h-80 overflow-y-auto">
                     {sources.map((item, index) => <ArticleItem key={index} article={item} />)}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;