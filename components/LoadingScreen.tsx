import React, { useEffect } from 'react';
import QuixyLogo from './QuixyLogo';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded();
    }, 10000); // Extended loading time to 10 seconds

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground animate-fadeIn">
        <div className="relative flex items-center justify-center w-32 h-32 opacity-0 animate-slideUpAndFadeIn" style={{ animationDelay: '200ms'}}>
            {/* Modernized loading animation: pulsating rings */}
            <div className="absolute h-16 w-16 rounded-full bg-primary/10 animate-ping"></div>
            <div className="absolute h-24 w-24 rounded-full bg-primary/10 animate-ping" style={{ animationDelay: '500ms' }}></div>
            <div className="absolute h-full w-full rounded-full bg-primary/5 blur-xl"></div>
            <QuixyLogo />
        </div>
        <div className="mt-8 text-center">
            <p 
                className="tracking-widest text-muted-foreground opacity-0 animate-slideUpAndFadeIn"
                style={{ animationDelay: '500ms' }}
            >
                Made by The BrightStone & Co Group
            </p>
            <p 
                className="mt-2 text-sm text-blue-500/70 tracking-wider opacity-0 animate-slideUpAndFadeIn"
                style={{ animationDelay: '700ms' }}
            >
                Powered by Google
            </p>
        </div>
    </div>
  );
};

export default LoadingScreen;