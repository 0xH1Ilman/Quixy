import React from 'react';

const BetaWarning: React.FC = () => {
    return (
        <div className="px-3 py-2 text-xs text-center text-yellow-300 bg-yellow-900/50 border border-yellow-700/50 rounded-lg">
            <strong>Versión Beta:</strong> Los datos pueden tener imprecisiones. No uses esta herramienta como único asesor financiero.
        </div>
    );
};

export default BetaWarning;
