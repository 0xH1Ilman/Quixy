import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded();
    }, 2500); 

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground animate-fadeIn">
        <div className="relative flex items-center justify-center w-32 h-32 opacity-0 animate-slideUpAndFadeIn" style={{ animationDelay: '200ms'}}>
            <div className="absolute h-16 w-16 rounded-full bg-primary/10 animate-ping"></div>
            <div className="absolute h-24 w-24 rounded-full bg-primary/10 animate-ping" style={{ animationDelay: '500ms' }}></div>
            <div className="absolute h-full w-full rounded-full bg-primary/5 blur-xl"></div>
            <div className="flex items-center gap-3">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
        <div className="mt-8 text-center">
            <p 
                className="text-2xl font-bold tracking-wider text-card-foreground opacity-0 animate-slideUpAndFadeIn"
                style={{ animationDelay: '500ms' }}
            >
                BrightStone Finance
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