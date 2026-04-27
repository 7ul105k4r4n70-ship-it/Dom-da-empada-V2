import React, { useState } from 'react';
import { Sparkles, X, Loader2, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AVAILABLE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

export function AISearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [modelIndex, setModelIndex] = useState(0);

  const getModelName = () => AVAILABLE_MODELS[modelIndex];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        setResponse("Erro: VITE_GEMINI_API_KEY não configurada.");
        setIsLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: getModelName() });
      
      const result = await model.generateContent(query);
      const text = result.response.text();
      setResponse(text);
    } catch (error: any) {
      console.error("Erro Gemini:", error);
      
      const errorMsg = error.message || "";
      
      if (errorMsg.includes("404") || errorMsg.includes("not found") || errorMsg.includes("does not support")) {
        if (modelIndex < AVAILABLE_MODELS.length - 1) {
          setModelIndex(prev => prev + 1);
          handleSearch(e);
          return;
        } else {
          setResponse("Todos os modelos disponíveis falharam. Por favor, tente novamente mais tarde ou verifique sua API Key.");
        }
      } else {
        setResponse(`Erro: ${errorMsg || "Problema na conexão com a IA"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative group flex items-center w-64 h-10 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 rounded-full transition-all duration-300"
      >
        <Sparkles className="absolute left-3 text-blue-500 w-4 h-4 group-hover:animate-pulse" />
        <span className="pl-10 pr-4 text-sm text-blue-700/70 font-medium">Pergunte à IA...</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-blue-100 overflow-hidden transform animate-in slide-in-from-top-8 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Assistente Inteligente</h3>
                  <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">
                    Google Gemini AI • {getModelName()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 min-h-[160px] max-h-[60vh] overflow-y-auto">
              {!response && !isLoading && (
                <div className="text-center space-y-3 mt-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Como posso ajudar hoje?</p>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center gap-3 text-blue-500 bg-blue-50 p-4 rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Consultando IA...</span>
                </div>
              )}

              {response && !isLoading && (
                <div className="flex gap-4 p-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{response}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Envie sua mensagem..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="absolute right-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
