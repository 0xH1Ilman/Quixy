import React, { useState, useRef, useEffect } from 'react';
import type { Message as MessageType, ApiResponse } from '../types';
import Message from './Message';
import { getFinancialResponse } from '../services/geminiService';
import { useDataContext } from '../contexts/DataContext';

const Chatbot: React.FC = () => {
  const { chatHistory, setChatHistory } = useDataContext();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
    
  const handleClearChat = () => {
    setChatHistory([
      {
        sender: 'bot',
        analysis: {
          response_type: 'general_text',
          conversational_response: "Historial limpiado. ¿En qué podemos enfocarnos ahora?",
        }
      },
    ]);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: MessageType = { sender: 'user', text: input };
    // Fix: Explicitly type the loading message object to ensure the array type is `MessageType[]`, resolving the type error where `sender` was inferred as `string` instead of `"bot" | "user"`.
    const loadingMessage: MessageType = { sender: 'bot', isLoading: true };
    // Fix: The DataContext's `setChatHistory` expects a Message[] array, not a function.
    // Stored the new state in a local variable to prevent stale closures after the await call.
    const historyWithLoading = [...chatHistory, userMessage, loadingMessage];
    setChatHistory(historyWithLoading);
    setInput('');

    try {
      const analysis = await getFinancialResponse(input);
      const botMessage: MessageType = {
        sender: 'bot',
        analysis: analysis,
      };
      // Fix: Replaced functional update, using the local variable `historyWithLoading` to build the new state.
      const finalHistory = [...historyWithLoading];
      finalHistory[finalHistory.length - 1] = botMessage;
      setChatHistory(finalHistory);
    } catch (error) {
      console.error('Error al obtener la respuesta financiera:', error);
      const errorResponse: ApiResponse = {
        response_type: 'general_text',
        conversational_response: 'Lo siento, no pude procesar tu solicitud en este momento. Por favor, intenta de nuevo.',
      };
      const errorMessage: MessageType = {
        sender: 'bot',
        analysis: errorResponse,
      };
      // Fix: Replaced functional update, using the local variable `historyWithLoading` to build the new state.
       const historyWithError = [...historyWithLoading];
       historyWithError[historyWithError.length - 1] = errorMessage;
       setChatHistory(historyWithError);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-slate-200">Chat de Análisis</h2>
          <button
              onClick={handleClearChat}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              aria-label="Limpiar historial del chat"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
              Limpiar
          </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatHistory.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta financiera aquí..."
            className="w-full bg-card text-foreground rounded-full py-3 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground rounded-full h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
            disabled={!input.trim()}
            aria-label="Enviar mensaje"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;