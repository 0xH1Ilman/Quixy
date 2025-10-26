import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  RadarChart,
  ComposedChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
  Brush,
} from 'recharts';
import type { Chart } from '../types';

interface SpecificChartProps {
  chart: Chart;
}

const SpecificChart: React.FC<SpecificChartProps> = ({ chart }) => {
  const isMultiTimeframe = useMemo(() => !!chart.timeframes && chart.timeframes.length > 0, [chart.timeframes]);
  const [activeTimeframe, setActiveTimeframe] = useState(isMultiTimeframe ? chart.timeframes![0] : null);

  const chartData = useMemo(() => {
    if (!chart.data) return [];
    if (isMultiTimeframe && activeTimeframe) {
      return (chart.data as Record<string, any[]>)[activeTimeframe] || [];
    }
    return chart.data as any[];
  }, [isMultiTimeframe, activeTimeframe, chart.data]);

  const yAxisPriceDomain = useMemo(() => {
    const priceKey = chart.dataKeys.find(k => k.name.toLowerCase() === 'precio')?.key;
    if (!priceKey || !chartData || chartData.length === 0) return ['auto', 'auto'];

    const prices = chartData.map(d => d[priceKey]).filter(p => typeof p === 'number');
    if (prices.length === 0) return ['auto', 'auto'];

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [chartData, chart.dataKeys]);

  if (!chart || !chartData || chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos para mostrar el gráfico.</div>;
  }
  
  const TimeframeSelector = () => {
    if (!isMultiTimeframe) return null;

    return (
      <div className="flex space-x-2 mb-4">
        {chart.timeframes!.map(tf => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeTimeframe === tf ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    );
  };
  
  const formatLargeNumber = (value: number) => {
    if (typeof value !== 'number') return value;
    if (Math.abs(value) >= 1e9) { return (value / 1e9).toFixed(1) + 'B'; }
    if (Math.abs(value) >= 1e6) { return (value / 1e6).toFixed(1) + 'M'; }
    if (Math.abs(value) >= 1e3) { return (value / 1e3).toFixed(1) + 'K'; }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 border border-border rounded-lg shadow-lg">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="text-sm flex justify-between items-center" style={{ color: pld.color }}>
              <span className="mr-2">{`${pld.name}:`}</span>
              <span className="font-mono font-bold">{pld.name.toLowerCase() === 'precio' ? `$${pld.value.toFixed(2)}` : formatLargeNumber(pld.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chart.type) {
      case 'composed':
        const priceKey = chart.dataKeys.find(k => k.name.toLowerCase() === 'precio');
        const volumeKey = chart.dataKeys.find(k => k.name.toLowerCase() === 'volumen');
        
        if (!priceKey || !volumeKey) return <div className="text-destructive">Configuración de gráfico compuesto inválida.</div>;

        return (
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id={`colorGradient-${priceKey.color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={priceKey.color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={priceKey.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis yAxisId="price" stroke={priceKey.color} fontSize={12} tick={{ fill: priceKey.color }} domain={yAxisPriceDomain} orientation="left" tickFormatter={(value) => `$${Number(value).toFixed(2)}`} />
            <YAxis yAxisId="volume" stroke={volumeKey.color} fontSize={12} tick={{ fill: volumeKey.color }} orientation="right" tickFormatter={formatLargeNumber} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "12px", color: 'var(--muted-foreground)'}} />
            <Area yAxisId="price" type="monotone" dataKey={priceKey.key} name={priceKey.name} stroke={priceKey.color} strokeWidth={2} dot={false} fillOpacity={1} fill={`url(#colorGradient-${priceKey.color})`} />
            <Bar yAxisId="volume" dataKey={volumeKey.key} name={volumeKey.name} fill={volumeKey.color} barSize={20} fillOpacity={0.5} />
            <Brush dataKey="name" height={25} stroke={priceKey.color} fill="var(--background)" travellerWidth={15}>
                <ComposedChart>
                    <Area yAxisId="price" type="monotone" dataKey={priceKey.key} stroke={priceKey.color} dot={false} fill={priceKey.color} />
                </ComposedChart>
            </Brush>
          </ComposedChart>
        );
      case 'line':
        return (
          <AreaChart data={chartData}>
             <defs>
              {chart.dataKeys.map(keyInfo => (
                <linearGradient key={`grad-${keyInfo.key}`} id={`colorGradient-${keyInfo.color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={keyInfo.color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={keyInfo.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tick={{ fill: 'var(--muted-foreground)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: "12px", color: 'var(--muted-foreground)'}}/>
            {chart.dataKeys.map(keyInfo => (
                <Area key={keyInfo.key} type="monotone" dataKey={keyInfo.key} name={keyInfo.name} stroke={keyInfo.color} strokeWidth={2} dot={false} fillOpacity={1} fill={`url(#colorGradient-${keyInfo.color})`} />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tick={{ fill: 'var(--muted-foreground)' }} tickFormatter={formatLargeNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "12px", color: 'var(--muted-foreground)'}} />
                {chart.dataKeys.map(keyInfo => (
                    <Bar key={keyInfo.key} dataKey={keyInfo.key} name={keyInfo.name} fill={keyInfo.color} />
                ))}
            </BarChart>
        );
      case 'radar':
        // ... (radar chart implementation)
      default:
        return <div className="text-destructive">Tipo de gráfico no soportado.</div>;
    }
  };

  return (
    <>
      <TimeframeSelector />
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </>
  );
};

export default SpecificChart;