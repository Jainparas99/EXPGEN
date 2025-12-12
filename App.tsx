import React, { useState } from 'react';
import PaperInput from './components/PaperInput';
import ReportViewer from './components/ReportViewer';
import { analyzePaper } from './services/gemini';
import { ExpGenOutput } from './types';

function App() {
  const [report, setReport] = useState<ExpGenOutput | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAnalyze = async (text: string, file: File | null, notes: string) => {
    setStatus('analyzing');
    setErrorMessage('');
    try {
      const result = await analyzePaper(text, file, notes);
      setReport(result);
      setStatus('idle');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred. Please check your API key and try again.');
    }
  };

  const reset = () => {
    setReport(null);
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={reset} role="button">
            <div className="bg-indigo-600 rounded-lg p-1.5">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ExpGen</span>
          </div>
          <div className="text-xs font-mono text-slate-400">v1.0.0 • Powered by Gemini</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {status === 'error' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </span>
            <button 
              onClick={() => setStatus('idle')} 
              className="text-sm font-semibold hover:text-red-900 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {!report ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <PaperInput onAnalyze={handleAnalyze} isAnalyzing={status === 'analyzing'} />
          </div>
        ) : (
          <ReportViewer data={report} onReset={reset} />
        )}
      </main>
    </div>
  );
}

export default App;
