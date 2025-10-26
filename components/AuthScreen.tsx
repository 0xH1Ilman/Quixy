import React from 'react';

// This component is not used in the current App structure,
// but can be implemented for authentication purposes later.
const AuthScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Autenticación</h1>
        <p className="text-gray-400 mt-2">
          La funcionalidad de inicio de sesión se implementará en el futuro.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
