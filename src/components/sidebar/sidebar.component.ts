import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  dataService = inject(DataService);
  labels = this.dataService.labels;
  newLabelName = signal('');

  addLabel() {
    this.dataService.addLabel(this.newLabelName());
    this.newLabelName.set('');
  }

  deleteLabel(id: string) {
    if (confirm('Are you sure you want to delete this label?')) {
      this.dataService.deleteLabel(id);
    }
  }
}
