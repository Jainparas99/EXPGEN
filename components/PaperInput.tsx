import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Sparkles, AlertCircle } from 'lucide-react';

interface PaperInputProps {
  onAnalyze: (text: string, file: File | null, notes: string) => void;
  isAnalyzing: boolean;
}

const PaperInput: React.FC<PaperInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !textInput.trim()) return;
    onAnalyze(activeTab === 'paste' ? textInput : '', activeTab === 'upload' ? file : null, notes);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          ExpGen
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Turn research papers into concrete, reproducible experiment plans using AI.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Upload PDF
            </div>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'paste'
                ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Paste Text
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  file ? 'border-indigo-200 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      className="ml-4 p-1 rounded-full hover:bg-indigo-200 text-indigo-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pointer-events-none">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload PDF</p>
                    <p className="text-xs text-slate-500">Up to 10MB supported</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste the full text of the paper here..."
                className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm font-mono text-slate-800"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Focus Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Focus on the RL part, or I want to re-implement the baseline only..."
              className="w-full h-20 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={(!file && !textInput.trim()) || isAnalyzing}
            className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              (!file && !textInput.trim()) || isAnalyzing
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Paper...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Experiment Plan
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex gap-4 items-start p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>
          ExpGen uses Gemini 2.5 Flash to analyze papers. While powerful, verify critical hyperparameters and formulas against the original text before running large-scale experiments.
        </p>
      </div>
    </div>
  );
};

export default PaperInput;
