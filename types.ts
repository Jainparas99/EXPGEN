export interface Experiment {
  id: string;
  goal: string;
  setup_summary: string;
  dataset: string;
  model_or_algorithm: string;
  hyperparameters: {
    learning_rate?: number | string;
    batch_size?: number | string;
    epochs?: number | string;
    optimizer?: string;
    regularization?: string;
    other_critical_params?: { name: string; value: string }[];
  };
  training_procedure: string[];
  evaluation_procedure: string[];
  expected_outcomes: string;
}

export interface Dataset {
  name: string;
  public_or_private: string;
  url?: string;
  modalities: string[];
}

export interface Ablation {
  name: string;
  what_it_tests: string;
}

export interface Baseline {
  name: string;
  notes: string;
}

export interface Extension {
  straightforward_extensions: string[];
  ambitious_extensions: string[];
}

export interface ExpGenOutput {
  research_question: string;
  motivation: string;
  key_contributions: string[];
  assumptions: string[];
  tasks_or_domains: string[];
  methods_summary: string;
  baselines: string[];
  metrics: string[];
  datasets: Dataset[];
  compute_requirements: {
    hardware: string;
    approximate_training_time: string;
  };
  experiments: Experiment[];
  ablations: Ablation[];
  baselines_to_implement: Baseline[];
  failure_modes: string[];
  // Implementation Plan
  data_preparation_steps: string[];
  model_definition_steps: string[];
  training_loop_steps: string[];
  evaluation_loop_steps: string[];
  logging_and_tracking: string[];
  pseudocode?: string; // Added field for Step 3
  // Analysis
  limitations: string[];
  reproducibility_risks: string[];
  ethical_considerations: string[];
  extensions_and_future_work: Extension;
  new_hypotheses: string[];
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';
