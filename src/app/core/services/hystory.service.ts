import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { map, of, tap } from 'rxjs';
import { HistoryData } from '../../shared/models/HistoryData';
import { environment } from '../../../environments/environment';

interface RawData {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

interface GetHistoryResponse {
  data: RawData[];
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private apiUrl = environment.URI + '/api/bars/v1/bars/count-back';
  historyData = signal<HistoryData[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getHistory(instrumentId: string) {
    const token = this.authService.accessTokenSignal();
    if (!token) return of([]);

    const params = {
      instrumentId,
      provider: 'oanda',
      interval: '1',
      periodicity: 'day',
      barsCount: '50',
    };

    return this.http.get<GetHistoryResponse>(this.apiUrl, { params }).pipe(
      map(res => res.data.map(data => this.transformHistory(data))),
      tap(data => this.historyData.set(data))
    );
  }

  transformHistory(rawBar: RawData): HistoryData {
    return {
      time: new Date(rawBar.t).valueOf() / 1000,
      open: rawBar.o,
      high: rawBar.h,
      low: rawBar.l,
      close: rawBar.c,
    };
  }
}
