export interface BrainDump {
  id: string; // uuid
  user_id: string;
  raw_text: string;
  created_at: string; // timestamptz
  source: string;

  ai_normalized_text: string | null;
  ai_type: 'task' | 'event' | 'idea' | 'note' | null;
  ai_priority: 'low' | 'medium' | 'high' | null;
  ai_time_bucket: 'today' | 'this_week' | 'this_month' | 'someday' | 'none' | null;
  ai_due_json: any | null; // jsonb
  ai_event_json: any | null; // jsonb
  ai_labels: string[] | null;
  created_via_ai: boolean;
  done_at: string | null; // timestamptz
}
