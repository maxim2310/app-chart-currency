import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { InstrumentService } from '../../../core/services/instrument.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-market-bar',
  imports: [MatCardModule, DatePipe],
  templateUrl: './market-bar.component.html',
  styleUrl: './market-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketBarComponent {
  selectedInstrument = computed(() =>
    this.instrumentService.selectedInstrument()
  );
  constructor(
    private instrumentService: InstrumentService,
    private socketService: WebSocketService
  ) {}
}
