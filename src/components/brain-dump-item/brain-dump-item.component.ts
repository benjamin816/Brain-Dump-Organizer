import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { BrainDump } from '../../models/brain-dump.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-brain-dump-item',
  standalone: true,
  templateUrl: './brain-dump-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrainDumpItemComponent {
  item = input.required<BrainDump>();
  dataService = inject(DataService);

  priorityClass = computed(() => {
    switch (this.item().ai_priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-600';
    }
  });

  markDone() {
    this.dataService.markAsDone(this.item().id);
  }
  
  unmarkDone() {
    this.dataService.unmarkAsDone(this.item().id);
  }

  sendToCalendar() {
    this.dataService.getCalendarPreview(this.item().id);
  }

  getDueDate(): string | null {
    const due = this.item().ai_due_json;
    if (!due || !due.has_due_date || !due.due_start_iso) {
        return null;
    }
    try {
        const date = new Date(due.due_start_iso);
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
        return null;
    }
  }
}
