import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Instrument } from '../../shared/models/Instrument';
import { map, Observable, tap } from 'rxjs';
import { SocketResponse } from './websocket.service';

interface GetInstrumentsResponse {
  data: Instrument[];
}

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  instrumentUrl =
    environment.URI +
    '/api/instruments/v1/instruments?provider=oanda&kind=forex';

  instrumentsSignal = signal<Instrument[]>([]);
  selectedInstrumentIndex: WritableSignal<number | null> = signal(null);
  selectedInstrument: Signal<Instrument | null> = computed(() => {
    const index = this.selectedInstrumentIndex();

    if (typeof index === 'number' && index >= 0 && this.instrumentsSignal()) {
      return this.instrumentsSignal()[index];
    }
    return null;
  });

  constructor(private http: HttpClient) {}

  getInstruments(): Observable<Instrument[]> {
    return this.http.get<GetInstrumentsResponse>(this.instrumentUrl).pipe(
      map(res => res.data),
      tap(instruments => {
        this.instrumentsSignal.set(instruments);
      })
    );
  }

  updateInstrument(newData: SocketResponse) {
    this.instrumentsSignal.update(instruments =>
      instruments.map(instrument => {
        if (instrument.id === newData.instrumentId) {
          return {
            ...instrument,
            price: newData.last?.price,
            timestamp: newData.last?.timestamp,
          };
        }
        return instrument;
      })
    );
  }
}
