import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  retryWhen,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { InstrumentService } from './instrument.service';

interface SocketMessage {
  type: 'l1-subscription';
  id: '1';
  instrumentId: string;
  provider: 'simulation';
  subscribe: true;
  kinds: ['ask', 'bid', 'last'];
}

export interface SocketResponse {
  last?: {
    change: number;
    changePct: number;
    price: number;
    timestamp: string;
    volume: number;
  };
  instrumentId: string;
  provider: 'simulation';
  type: 'l1-update';
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws$: WebSocketSubject<SocketResponse | SocketMessage> | null = null;
  private readonly reconnectInterval = 2000;
  private destroy$ = new Subject();

  private messageSignal = signal<SocketResponse | null>(null);

  constructor(
    private authService: AuthService,
    private instrumentService: InstrumentService
  ) {}

  connect() {
    if (this.ws$) {
      this.close();
    }

    const token = this.authService.accessTokenSignal();
    if (!token) return throwError(() => new Error('No access token available'));

    this.ws$ = webSocket({
      url: `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${token}`,
      deserializer: msg => JSON.parse(msg.data),
      serializer: msg => JSON.stringify(msg),
      openObserver: {
        next: () => console.log('WebSocket connected'),
      },
      closeObserver: {
        next: () => console.log('WebSocket disconnected'),
      },
    });

    return this.ws$
      .pipe(
        takeUntil(this.destroy$),
        tap(msg => {
          if (msg.type === 'l1-update' && msg.last) {
            this.messageSignal.set(msg);
            this.instrumentService.updateInstrument(msg);
          }
        }), // Emit messages
        retryWhen(errors =>
          errors.pipe(
            tap(err => console.error('WebSocket error:', err)),
            switchMap(() => timer(this.reconnectInterval))
          )
        )
      )
      .subscribe();
  }

  sendMessage(message: SocketMessage) {
    if (this.ws$) {
      this.ws$.next(message);
    } else {
      console.warn('WebSocket not connected');
    }
  }

  subscribeToInstrument(instrumentId: string) {
    const message: SocketMessage = {
      type: 'l1-subscription',
      id: '1',
      instrumentId,
      provider: 'simulation',
      subscribe: true,
      kinds: ['ask', 'bid', 'last'],
    };
    this.sendMessage(message);
  }

  close() {
    this.ws$?.unsubscribe();
    this.destroy$.next(null);
  }
}
