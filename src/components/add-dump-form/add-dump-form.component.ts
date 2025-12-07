import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-add-dump-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-dump-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDumpFormComponent {
  dataService = inject(DataService);
  rawText = signal('');

  async handleSubmit() {
    await this.dataService.addBrainDump(this.rawText());
    if(!this.dataService.geminiError()) {
        this.rawText.set('');
    }
  }
}
