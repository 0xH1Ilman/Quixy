import React from 'react';
import QuixyLogo from './QuixyLogo';
import BetaWarning from './BetaWarning';
import type { View, NavItemProps } from '../types';

interface SidebarProps {
  currentView: View | 'home';
  onSetView: (view: View | 'home') => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, isActive, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView }) => {
  const navItems = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      label: 'Chat de Análisis',
      view: 'chat' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      label: 'Gráfico de Acciones',
      view: 'charts' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
      label: 'Buscador de Acciones',
      view: 'screener' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      label: 'Crear Portafolio',
      view: 'portfolio' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      label: 'Resumen de Mercado',
      view: 'market' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: 'Mercado Local',
      view: 'local_market' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-1 8h.01" /></svg>,
      label: 'Noticias',
      view: 'news' as View,
    },
     {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      label: 'Rendimiento Sectorial',
      view: 'sectors' as View,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.722 16.545l.007-.007-.007.007zM16.278 16.545l.007-.007-.007.007zM11 21H3.622a2 2 0 01-1.995-1.858L1 11.585V6a2 2 0 012-2h14a2 2 0 012 2v5.585l.627 7.557A2 2 0 0118.378 21H13" /></svg>,
      label: 'Indicadores',
      view: 'indicators' as View,
    },
  ];

  return (
    <aside className="w-64 bg-card flex flex-col p-4 border-r border-border">
      <div className="mb-6">
        <QuixyLogo />
      </div>
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onSetView('home')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${
            currentView === 'home'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">Inicio</span>
        </button>
        {navItems.map(item => (
          <NavItem
            key={item.view}
            {...item}
            isActive={currentView === item.view}
            onClick={onSetView}
          />
        ))}
      </nav>
      <div className="mt-auto">
        <BetaWarning />
        <p className="text-center text-xs text-muted-foreground mt-2">Creado por Manuel Bravo</p>
      </div>
    </aside>
  );
};

export default Sidebar;