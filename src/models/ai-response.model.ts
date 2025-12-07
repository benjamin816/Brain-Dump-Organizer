export interface AiResponse {
  normalized_text: string;
  type: 'task' | 'event' | 'idea' | 'note';
  priority: 'low' | 'medium' | 'high';
  time_bucket: 'today' | 'this_week' | 'this_month' | 'someday' | 'none';
  due: {
    has_due_date: boolean;
    due_start_iso: string | null;
    due_end_iso: string | null;
    is_all_day: boolean;
  };
  event: {
    should_create_event: boolean;
    title: string | null;
    start_iso: string | null;
    end_iso: string | null;
    is_all_day: boolean;
    location: string | null;
  };
  labels: string[];
  suggested_new_labels: string[];
  notes: string | null;
}
