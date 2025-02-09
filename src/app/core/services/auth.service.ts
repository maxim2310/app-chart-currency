import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenUrl = `/identity/realms/fintatech/protocol/openid-connect/token`;

  accessTokenSignal = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getToken(): Observable<AuthResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', 'app-cli')
      .set('username', environment.USERNAME)
      .set('password', environment.PASSWORD);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<AuthResponse>(this.tokenUrl, body.toString(), { headers })
      .pipe(
        tap(response => {
          if (response.access_token) {
            this.accessTokenSignal.set(response.access_token);
          }
        })
      );
  }
}
