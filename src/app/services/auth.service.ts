import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AppRole = 'USER' | 'ADMIN' | 'MAGACIONER';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.post(`${this.apiUrl}/login`, { username, password }).subscribe(
        (data: any) => {
          if (data && data.token) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', data.token);

            const payload = this.decodeJwtPayload(data.token);
            if (payload?.userId != null) {
              localStorage.setItem('userId', String(payload.userId));
            }

            const role = this.getRoleFromToken(data.token) ?? 'USER';
            localStorage.setItem('role', role);
            localStorage.setItem('isAdmin', String(role === 'ADMIN'));
            localStorage.setItem('isMagacioner', String(role === 'MAGACIONER'));

            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.error('Login error:', error);
          resolve(false);
        }
      );
    });
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isMagacioner');
  }

  getUser(): string | null {
    return localStorage.getItem('username');
  }

  getUserId(): number | null {
    const raw = localStorage.getItem('userId');
    return raw ? Number(raw) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getRole(): AppRole | null {
    const r = localStorage.getItem('role') as AppRole | null;
    return r ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isMagacioner(): boolean {
    return this.getRole() === 'MAGACIONER';
  }

  // JWT decode helpers
private getRoleFromToken(token: string): AppRole | null {
  const payload = this.decodeJwtPayload(token);
  if (!payload) return null;

  const raw =
    payload['authorities'] ??
    payload['roles'] ??
    payload['role'] ??
    payload['AUTHORITIES'] ??
    payload['AUTHORITIES_KEY'];

  if (!raw) return null;

  const list: string[] = [];

  if (Array.isArray(raw)) {
    list.push(...raw.map(String));
  } else {
    list.push(...String(raw).split(',').map(s => s.trim()));
  }

  for (const item of list) {
    const normalized = item.replace(/^ROLE_/, '').trim();
    if (normalized === 'ADMIN' || normalized === 'USER' || normalized === 'MAGACIONER') {
      return normalized as AppRole;
    }
  }

  return null;
}

  private decodeJwtPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');

      const padded = payloadBase64 + '='.repeat((4 - (payloadBase64.length % 4)) % 4);

      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
