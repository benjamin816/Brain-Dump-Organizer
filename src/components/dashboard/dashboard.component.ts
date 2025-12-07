import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { BrainDumpItemComponent } from '../brain-dump-item/brain-dump-item.component';
import { BrainDump } from '../../models/brain-dump.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BrainDumpItemComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  dataService = inject(DataService);

  private filterAndSort(timeBucket: BrainDump['ai_time_bucket']) {
    return computed(() =>
      this.dataService.brainDumps()
        .filter(d => 
          d.ai_time_bucket === timeBucket && 
          (d.ai_type === 'task' || d.ai_type === 'event') && 
          !d.done_at
        )
        .sort((a,b) => {
             const priorityOrder = { high: 1, medium: 2, low: 3 };
             return (priorityOrder[a.ai_priority!] ?? 4) - (priorityOrder[b.ai_priority!] ?? 4);
        })
    );
  }

  todayItems = this.filterAndSort('today');
  weekItems = this.filterAndSort('this_week');
  monthItems = this.filterAndSort('this_month');
  somedayItems = this.filterAndSort('someday');

  doneItems = computed(() => this.dataService.brainDumps()
    .filter(d => d.done_at)
    .sort((a, b) => new Date(b.done_at!).getTime() - new Date(a.done_at!).getTime())
    .slice(0, 10) // show last 10 completed items
  );
}
