import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/services/auth.service';
import { InstrumentService } from './core/services/instrument.service';
import { InstrumentSelectorComponent } from './shared/components/instrument selector/instrument-selector.component';
import { HistoryChartComponent } from './shared/components/history-chart/history-chart.component';
import { MarketBarComponent } from './shared/components/market-bar/market-bar.component';
import { WebSocketService } from './core/services/websocket.service';
import { Instrument } from './shared/models/Instrument';

@Component({
  selector: 'app-root',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    InstrumentSelectorComponent,
    MarketBarComponent,
    HistoryChartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  selectedInstrument = computed(() =>
    this.instrumentService.selectedInstrument()
  );
  prevInstrument = signal<Instrument | null>(null);

  constructor(
    private authService: AuthService,
    private instrumentService: InstrumentService,
    private socketService: WebSocketService
  ) {
    effect(() => {
      console.log('New token:', this.authService.accessTokenSignal());

      if (this.authService.accessTokenSignal()) {
        this.instrumentService.getInstruments().subscribe({
          error: (e: unknown) => {
            console.log(e);
          },
        });
      }
    });

    //TODO: delete
    effect(() => {
      const token = this.authService.accessTokenSignal();
      const instrument = this.selectedInstrument();
      console.log(instrument);
      if (token && instrument && instrument.id !== this.prevInstrument()?.id) {
        this.socketService.connect();
        this.socketService.subscribeToInstrument(instrument.id);
        this.prevInstrument.set(instrument);
      }
    });
  }

  ngOnInit(): void {
    this.authService.getToken().subscribe({
      error: (e: unknown) => {
        console.log(e);
      },
    });
  }
}
