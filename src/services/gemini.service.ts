import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { AiResponse } from '../models/ai-response.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  error = signal<string | null>(null);

  constructor() {
    // IMPORTANT: In a real production app, the API key must be kept secret on a server.
    // Exposing it in the client-side code is a security risk.
    // This implementation assumes the key is provided via an environment variable
    // during the build process, and this app is for demonstration purposes.
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.error('Gemini API key not found. Please set the API_KEY environment variable.');
      this.error.set('Gemini API key not found.');
    }
  }

  async classifyBrainDump(entry_text: string, allowed_labels: string[]): Promise<AiResponse | null> {
    if (!this.ai) {
      this.error.set('Gemini service is not initialized.');
      return null;
    }
    this.error.set(null);

    const schema = {
      type: Type.OBJECT,
      properties: {
        normalized_text: { type: Type.STRING, description: "A concise, action-oriented version of the input text." },
        type: { type: Type.STRING, enum: ['task', 'event', 'idea', 'note'], description: "The primary category of the item." },
        priority: { type: Type.STRING, enum: ['low', 'medium', 'high'], description: "The priority level." },
        time_bucket: { type: Type.STRING, enum: ['today', 'this_week', 'this_month', 'someday', 'none'], description: "The best time frame to address this item." },
        due: {
          type: Type.OBJECT,
          properties: {
            has_due_date: { type: Type.BOOLEAN },
            due_start_iso: { type: Type.STRING, nullable: true, description: "The start of the due date in ISO 8601 format." },
            due_end_iso: { type: Type.STRING, nullable: true, description: "The end of the due date in ISO 8601 format." },
            is_all_day: { type: Type.BOOLEAN }
          }
        },
        event: {
          type: Type.OBJECT,
          properties: {
            should_create_event: { type: Type.BOOLEAN },
            title: { type: Type.STRING, nullable: true },
            start_iso: { type: Type.STRING, nullable: true, description: "Event start time in ISO 8601 format." },
            end_iso: { type: Type.STRING, nullable: true, description: "Event end time in ISO 8601 format." },
            is_all_day: { type: Type.BOOLEAN },
            location: { type: Type.STRING, nullable: true }
          }
        },
        labels: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: `A list of relevant labels for the text, chosen ONLY from the provided allowed labels list.`
        },
        suggested_new_labels: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: `1-2 new label suggestions if the existing labels are insufficient. Otherwise, an empty array.`
        },
        notes: { type: Type.STRING, nullable: true, description: "Any additional notes or context." }
      },
      required: ["normalized_text", "type", "priority", "time_bucket", "due", "event", "labels", "suggested_new_labels"]
    };

    const prompt = `Analyze the following brain dump text. Classify it, extract key information, and suggest labels. Your response MUST be a valid JSON object matching the provided schema. The current time is ${new Date().toISOString()}.
    
    Allowed labels: [${allowed_labels.join(', ') || 'none'}]
    
    Brain dump text: "${entry_text}"`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as AiResponse;
    } catch (e) {
      console.error('Error calling Gemini API:', e);
      this.error.set('Failed to process text with AI. Please check the console for details.');
      return null;
    }
  }
}
