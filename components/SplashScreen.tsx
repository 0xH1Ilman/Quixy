import React from 'react';
import QuixyLogo from './QuixyLogo';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground animate-fadeIn">
      <div className="flex flex-col items-center gap-6">
        <QuixyLogo />
        <p className="text-lg text-muted-foreground">Inteligencia de mercado, simplificada.</p>
      </div>
      <button
        onClick={onStart}
        className="mt-12 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
      >
        Iniciar
      </button>
    </div>
  );
};

export default SplashScreen;
