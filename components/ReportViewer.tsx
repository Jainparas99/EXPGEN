import React, { useState } from 'react';
import { 
  BookOpen, 
  Beaker, 
  Code2, 
  AlertTriangle, 
  Download, 
  ChevronRight, 
  CheckCircle2,
  Cpu,
  Database,
  Layers
} from 'lucide-react';
import { ExpGenOutput, Experiment } from '../types';

interface ReportViewerProps {
  data: ExpGenOutput;
  onReset: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ data, onReset }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'experiments' | 'implementation' | 'analysis'>('overview');
  const [expandedExp, setExpandedExp] = useState<string | null>(null);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiment_plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeSection, label: string, icon: any }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeSection === id 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button onClick={onReset} className="text-sm text-slate-500 hover:text-indigo-600 mb-2 hover:underline">
            ← Analyze another paper
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
        </div>
        <button 
          onClick={downloadJSON}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium text-sm transition"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-6">
        <TabButton id="overview" label="Overview" icon={BookOpen} />
        <TabButton id="experiments" label="Experiments" icon={Beaker} />
        <TabButton id="implementation" label="Implementation" icon={Code2} />
        <TabButton id="analysis" label="Analysis & Risks" icon={AlertTriangle} />
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Research Question & Motivation</h3>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <p className="font-medium text-indigo-900">Question</p>
                  <p className="text-indigo-800">{data.research_question}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Motivation</p>
                  <p className="text-slate-600">{data.motivation}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Contributions</h3>
              <ul className="space-y-2">
                {data.key_contributions.map((c, i) => (
                  <li key={i} className="flex gap-2 text-slate-700">
                    <span className="text-indigo-500 mt-1">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Core Method</h3>
              <p className="text-slate-700 mb-4">{data.methods_summary}</p>
              <div className="flex flex-wrap gap-2">
                {data.tasks_or_domains.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" /> Datasets
              </h3>
              <div className="space-y-3">
                {data.datasets.map((d, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-slate-800">{d.name}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${d.public_or_private.toLowerCase().includes('public') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {d.public_or_private}
                      </span>
                    </div>
                    {d.url && <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline break-all mt-1 block">{d.url}</a>}
                    <div className="mt-2 flex gap-1">
                      {d.modalities.map((m, j) => (
                        <span key={j} className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{m}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" /> Resources
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Hardware</p>
                  <p className="text-sm text-slate-900 mt-1">{data.compute_requirements.hardware}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Time</p>
                  <p className="text-sm text-slate-900 mt-1">{data.compute_requirements.approximate_training_time}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPERIMENTS SECTION */}
        {activeSection === 'experiments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Proposed Experiments</h3>
            <div className="grid grid-cols-1 gap-6">
              {data.experiments.map((exp) => (
                <div key={exp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex justify-between items-center"
                    onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-mono rounded">
                          {exp.id}
                        </span>
                        <h4 className="font-semibold text-slate-900">{exp.goal}</h4>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2">{exp.setup_summary}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedExp === exp.id ? 'rotate-90' : ''}`} />
                  </div>

                  {expandedExp === exp.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Configuration</p>
                            <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm space-y-2 font-mono">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Dataset</span>
                                <span className="text-slate-900">{exp.dataset}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Model</span>
                                <span className="text-slate-900 text-right">{exp.model_or_algorithm}</span>
                              </div>
                              {Object.entries(exp.hyperparameters).map(([k, v]) => {
                                if (k === 'other_critical_params') return null;
                                return (
                                  <div key={k} className="flex justify-between">
                                    <span className="text-slate-500">{k}</span>
                                    <span className="text-slate-900">{String(v)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {exp.hyperparameters.other_critical_params && exp.hyperparameters.other_critical_params.length > 0 && (
                            <div>
                               <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Critical Params</p>
                               <div className="flex flex-wrap gap-2">
                                  {exp.hyperparameters.other_critical_params.map((param, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded font-mono">
                                      {param.name}: {param.value}
                                    </span>
                                  ))}
                               </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Procedure</p>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
                              {exp.training_procedure.map((step, idx) => (
                                <li key={idx} className="pl-1 py-0.5">{step}</li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expected Outcomes</p>
                            <div className="p-3 bg-green-50 text-green-800 text-sm rounded-lg border border-green-100">
                              {exp.expected_outcomes}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Ablations</h3>
                 <ul className="space-y-3">
                   {data.ablations.map((ab, i) => (
                     <li key={i} className="text-sm">
                       <span className="font-semibold block text-slate-800">{ab.name}</span>
                       <span className="text-slate-600">{ab.what_it_tests}</span>
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Baselines</h3>
                 <ul className="space-y-3">
                   {data.baselines_to_implement.map((ab, i) => (
                     <li key={i} className="text-sm">
                       <span className="font-semibold block text-slate-800">{ab.name}</span>
                       <span className="text-slate-600">{ab.notes}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          </div>
        )}

        {/* IMPLEMENTATION SECTION */}
        {activeSection === 'implementation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                  <span className="text-slate-400 text-xs font-mono">pseudocode.py</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  </div>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre">
                    {data.pseudocode || "# No pseudocode generated."}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                 <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" /> Model Definition
                 </h4>
                 <ul className="space-y-2">
                    {data.model_definition_steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700">
                            <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span>{step}</span>
                        </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                 <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Evaluation Loop
                 </h4>
                 <ul className="space-y-2">
                    {data.evaluation_loop_steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700">
                            <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span>{step}</span>
                        </li>
                    ))}
                 </ul>
              </div>
            </div>
          </div>
        )}

        {/* ANALYSIS SECTION */}
        {activeSection === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-400">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Limitations</h3>
                <ul className="space-y-2 list-disc list-inside text-slate-700">
                    {data.limitations.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-400">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Reproducibility Risks</h3>
                <ul className="space-y-2 list-disc list-inside text-slate-700">
                    {data.reproducibility_risks.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
             </div>

             <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">Future Directions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Straightforward</h4>
                        <ul className="space-y-2 text-slate-700">
                            {data.extensions_and_future_work.straightforward_extensions.map((e, i) => (
                                <li key={i} className="flex gap-2"><span className="text-indigo-400">→</span>{e}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Ambitious</h4>
                        <ul className="space-y-2 text-slate-700">
                            {data.extensions_and_future_work.ambitious_extensions.map((e, i) => (
                                <li key={i} className="flex gap-2"><span className="text-purple-400">→</span>{e}</li>
                            ))}
                        </ul>
                    </div>
                </div>
             </div>
             
             {data.new_hypotheses && data.new_hypotheses.length > 0 && (
                 <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" /> New Hypotheses to Test
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.new_hypotheses.map((h, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 italic text-slate-700">
                                "{h}"
                            </div>
                        ))}
                    </div>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// Lucide icon helper
function Sparkles(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}

export default ReportViewer;
