import React from 'react';

const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      <h1 className="text-xl font-semibold tracking-wide text-card-foreground">
        BrightStone Finance
      </h1>
    </div>
  );
};

export default BrandLogo;