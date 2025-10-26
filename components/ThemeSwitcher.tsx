import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', label: 'Claro' },
    { name: 'dark', label: 'Oscuro' },
    { name: 'high-contrast', label: 'Contraste' },
  ];

  return (
    <div className="flex items-center gap-1 bg-card p-1 rounded-full border border-border">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name as any)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
            theme === t.name
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/50'
          }`}
          aria-pressed={theme === t.name}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
