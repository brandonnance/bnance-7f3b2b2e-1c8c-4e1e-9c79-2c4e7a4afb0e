import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  access_token: string;
}

type RoleName = 'OWNER' | 'ADMIN' | 'VIEWER';

interface DecodedToken {
  sub: string;
  email: string;
  role: RoleName;
  organizationId: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'tv_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:3000/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setToken(res.access_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getRole(): RoleName | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role ?? null;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  getOrganizationId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.organizationId ?? null;
    } catch (err) {
      console.error('Error decoding token', err);
      return null;
    }
  }
}
