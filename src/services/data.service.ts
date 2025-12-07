import { Injectable, signal, computed, inject } from '@angular/core';
import { BrainDump } from '../models/brain-dump.model';
import { Label } from '../models/label.model';
import { GeminiService } from './gemini.service';
import { AiResponse } from '../models/ai-response.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private geminiService = inject(GeminiService);

  // Signals for state management
  brainDumps = signal<BrainDump[]>([]);
  labels = signal<Label[]>([]);
  loading = signal<boolean>(false);
  geminiError = this.geminiService.error;

  constructor() {
    this.loadInitialData();
  }

  loadInitialData() {
    // In a real app, this would fetch data from a backend API.
    // Here we use mock data for demonstration.
    const mockLabels: Label[] = [
      { id: '1', user_id: 'demo_user', name: 'work', created_at: new Date().toISOString() },
      { id: '2', user_id: 'demo_user', name: 'personal', created_at: new Date().toISOString() },
      { id: '3', user_id: 'demo_user', name: 'shopping', created_at: new Date().toISOString() },
    ];
    this.labels.set(mockLabels);

    const mockDumps: BrainDump[] = [
      {
        id: '101',
        user_id: 'demo_user',
        raw_text: 'Finish the Q3 report presentation by Friday EOD',
        created_at: new Date().toISOString(),
        source: 'ui',
        ai_normalized_text: 'Finish Q3 report presentation',
        ai_type: 'task',
        ai_priority: 'high',
        ai_time_bucket: 'this_week',
        ai_due_json: { has_due_date: true },
        ai_event_json: { should_create_event: false },
        ai_labels: ['work'],
        created_via_ai: true,
        done_at: null,
      },
       {
        id: '102',
        user_id: 'demo_user',
        raw_text: 'Pick up milk and bread from the store tomorrow morning',
        created_at: new Date().toISOString(),
        source: 'ui',
        ai_normalized_text: 'Buy milk and bread',
        ai_type: 'task',
        ai_priority: 'medium',
        ai_time_bucket: 'today',
        ai_due_json: null,
        ai_event_json: null,
        ai_labels: ['shopping', 'personal'],
        created_via_ai: true,
        done_at: null,
      },
    ];
    this.brainDumps.set(mockDumps);
  }

  async addBrainDump(rawText: string) {
    if (!rawText.trim()) return;

    this.loading.set(true);
    const currentLabels = this.labels().map(l => l.name);
    const aiResult = await this.geminiService.classifyBrainDump(rawText, currentLabels);

    if (aiResult) {
      this.createNewDumpFromAI(rawText, aiResult);
      // Auto-add suggested labels
      aiResult.suggested_new_labels?.forEach(newLabelName => {
        if (!currentLabels.includes(newLabelName.toLowerCase())) {
          this.addLabel(newLabelName);
        }
      });
    }
    this.loading.set(false);
  }
  
  private createNewDumpFromAI(rawText: string, aiResult: AiResponse) {
    const newDump: BrainDump = {
      id: crypto.randomUUID(),
      user_id: 'demo_user',
      raw_text: rawText,
      created_at: new Date().toISOString(),
      source: 'ui',
      ai_normalized_text: aiResult.normalized_text,
      ai_type: aiResult.type,
      ai_priority: aiResult.priority,
      ai_time_bucket: aiResult.time_bucket,
      ai_due_json: aiResult.due,
      ai_event_json: aiResult.event,
      ai_labels: aiResult.labels,
      created_via_ai: true,
      done_at: null,
    };

    this.brainDumps.update(dumps => [newDump, ...dumps]);
  }

  markAsDone(id: string) {
    this.brainDumps.update(dumps =>
      dumps.map(dump =>
        dump.id === id ? { ...dump, done_at: new Date().toISOString() } : dump
      )
    );
  }
  
  unmarkAsDone(id: string) {
      this.brainDumps.update(dumps =>
          dumps.map(dump =>
              dump.id === id ? { ...dump, done_at: null } : dump
          )
      );
  }

  addLabel(name: string) {
    if (!name.trim() || this.labels().some(l => l.name.toLowerCase() === name.trim().toLowerCase())) {
      return;
    }
    const newLabel: Label = {
      id: crypto.randomUUID(),
      user_id: 'demo_user',
      name: name.trim(),
      created_at: new Date().toISOString(),
    };
    this.labels.update(labels => [...labels, newLabel]);
  }

  deleteLabel(id: string) {
    this.labels.update(labels => labels.filter(l => l.id !== id));
    // Also remove the label from any dumps that have it
    this.brainDumps.update(dumps => dumps.map(d => ({
        ...d,
        ai_labels: d.ai_labels?.filter(l => l !== this.labels().find(label => label.id === id)?.name) ?? []
    })));
  }
  
  getCalendarPreview(id: string) {
      const dump = this.brainDumps().find(d => d.id === id);
      if (dump && dump.ai_event_json && dump.ai_event_json.should_create_event) {
          // This is a stub as requested. In a real app, this would call the backend.
          alert(`Calendar Preview:\nTitle: ${dump.ai_event_json.title}\nStart: ${dump.ai_event_json.start_iso}\nEnd: ${dump.ai_event_json.end_iso}`);
      } else {
          alert('This item is not marked as a calendar event.');
      }
  }
}
