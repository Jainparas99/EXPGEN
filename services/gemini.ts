import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { ExpGenOutput } from "../types";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    research_question: { type: Type.STRING },
    motivation: { type: Type.STRING },
    key_contributions: { type: Type.ARRAY, items: { type: Type.STRING } },
    assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    tasks_or_domains: { type: Type.ARRAY, items: { type: Type.STRING } },
    methods_summary: { type: Type.STRING },
    baselines: { type: Type.ARRAY, items: { type: Type.STRING } },
    metrics: { type: Type.ARRAY, items: { type: Type.STRING } },
    datasets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          public_or_private: { type: Type.STRING },
          url: { type: Type.STRING, nullable: true },
          modalities: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "public_or_private", "modalities"],
      },
    },
    compute_requirements: {
      type: Type.OBJECT,
      properties: {
        hardware: { type: Type.STRING },
        approximate_training_time: { type: Type.STRING },
      },
      required: ["hardware", "approximate_training_time"],
    },
    experiments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          goal: { type: Type.STRING },
          setup_summary: { type: Type.STRING },
          dataset: { type: Type.STRING },
          model_or_algorithm: { type: Type.STRING },
          hyperparameters: {
            type: Type.OBJECT,
            properties: {
              learning_rate: { type: Type.STRING, nullable: true },
              batch_size: { type: Type.STRING, nullable: true },
              epochs: { type: Type.STRING, nullable: true },
              optimizer: { type: Type.STRING, nullable: true },
              regularization: { type: Type.STRING, nullable: true },
              other_critical_params: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.STRING },
                  },
                  required: ["name", "value"],
                },
                nullable: true,
              },
            },
          },
          training_procedure: { type: Type.ARRAY, items: { type: Type.STRING } },
          evaluation_procedure: { type: Type.ARRAY, items: { type: Type.STRING } },
          expected_outcomes: { type: Type.STRING },
        },
        required: ["id", "goal", "setup_summary", "dataset", "model_or_algorithm", "training_procedure", "evaluation_procedure", "expected_outcomes"],
      },
    },
    ablations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          what_it_tests: { type: Type.STRING },
        },
        required: ["name", "what_it_tests"],
      },
    },
    baselines_to_implement: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["name", "notes"],
      },
    },
    failure_modes: { type: Type.ARRAY, items: { type: Type.STRING } },
    data_preparation_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    model_definition_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    training_loop_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    evaluation_loop_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    logging_and_tracking: { type: Type.ARRAY, items: { type: Type.STRING } },
    pseudocode: { type: Type.STRING },
    limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
    reproducibility_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
    ethical_considerations: { type: Type.ARRAY, items: { type: Type.STRING } },
    extensions_and_future_work: {
      type: Type.OBJECT,
      properties: {
        straightforward_extensions: { type: Type.ARRAY, items: { type: Type.STRING } },
        ambitious_extensions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["straightforward_extensions", "ambitious_extensions"],
    },
    new_hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "research_question",
    "motivation",
    "key_contributions",
    "assumptions",
    "tasks_or_domains",
    "methods_summary",
    "baselines",
    "metrics",
    "datasets",
    "compute_requirements",
    "experiments",
    "ablations",
    "baselines_to_implement",
    "failure_modes",
    "data_preparation_steps",
    "model_definition_steps",
    "training_loop_steps",
    "evaluation_loop_steps",
    "logging_and_tracking",
    "pseudocode",
    "limitations",
    "reproducibility_risks",
    "ethical_considerations",
    "extensions_and_future_work",
    "new_hypotheses"
  ]
};

const parseJSON = (text: string): ExpGenOutput => {
  try {
    // Attempt to locate the first curly brace and the last curly brace
    // This helps if the model adds markdown code blocks or preamble text
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonString = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonString) as ExpGenOutput;
    }
    
    // Fallback to parsing the whole text
    return JSON.parse(text) as ExpGenOutput;
  } catch (e: any) {
    console.error("Failed to parse Gemini response as JSON", e);
    // Detect truncation issues common with large outputs
    if ((e instanceof SyntaxError && e.message.includes("Unterminated string")) || (e instanceof SyntaxError && e.message.includes("End of data"))) {
       throw new Error("The analysis was too long and got cut off. Please try again with a shorter paper or ask for a more concise analysis in the notes.");
    }
    throw new Error("The AI response was not valid JSON. Please try again.");
  }
};

export const analyzePaper = async (
  textInput: string,
  file: File | null,
  userNotes: string
): Promise<ExpGenOutput> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-2.5-flash for speed and large context handling.
  const modelName = "gemini-2.5-flash"; 

  const parts: any[] = [];

  // Add the paper content
  if (file) {
    const base64Data = await fileToBase64(file);
    parts.push({
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    });
    parts.push({ text: "Please analyze the attached research paper." });
  } else if (textInput) {
    parts.push({ text: `Here is the content of the research paper:\n\n${textInput}` });
  } else {
    throw new Error("No paper content provided.");
  }

  // Add user specific focus notes
  if (userNotes) {
    parts.push({ text: `\nUser's specific focus/notes: ${userNotes}` });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        // Increased token limit to prevent truncation of large experimental plans
        maxOutputTokens: 32768, 
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    return parseJSON(response.text);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes("Too many tokens")) {
       throw new Error("The paper is too large to process. Please try a smaller file or text selection.");
    }
    throw new Error(error.message || "An error occurred while analyzing the paper.");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
