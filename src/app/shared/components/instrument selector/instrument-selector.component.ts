import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InstrumentService } from '../../../core/services/instrument.service';
import { Instrument } from '../../models/Instrument';

@Component({
  selector: 'app-instrument-selector',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './instrument-selector.component.html',
  styleUrl: './instrument-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentSelectorComponent {
  selectedInstrumentIndex = 0;
  instruments: Signal<Instrument[]> = computed(() =>
    this.instrumentService.instrumentsSignal()
  );
  selectedInstrument = computed(() =>
    this.instrumentService.selectedInstrument()
  );

  constructor(private instrumentService: InstrumentService) {}

  onSubscribe() {
    this.instrumentService.selectedInstrumentIndex.set(
      this.selectedInstrumentIndex
    );
  }
}
