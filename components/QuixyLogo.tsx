import React from 'react';

const QuixyLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      <h1 className="text-xl font-semibold tracking-wider text-slate-200">
        Quixy
      </h1>
    </div>
  );
};

export default QuixyLogo;
