import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

export interface AuthUser { id: string; username: string; email?: string; role?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = '/api/auth';
  private tokenKey = 'feast_token_v1';
  private userKey = 'feast_user_v1';
  user: AuthUser | null = null;
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const u = localStorage.getItem(this.userKey);
    if (u) {
      this.user = JSON.parse(u);
      this.userSubject.next(this.user);
    }
  }

  get token(): string | null { return localStorage.getItem(this.tokenKey); }
  isAuthenticated(): boolean { return !!this.token; }
  get currentUser(): AuthUser | null { return this.user; }
  hasRole(role: string): boolean { return (this.user?.role || '').toUpperCase() === role.toUpperCase(); }

  login(usernameOrEmail: string, password: string): Observable<AuthUser> {
    return this.http.post<any>(`${this.base}/login`, { usernameOrEmail, password }).pipe(
      tap(res => this.store(res.token, res.user)),
      map(res => res.user)
    );
  }

  register(username: string, email: string, password: string): Observable<AuthUser> {
    return this.http.post<any>(`${this.base}/register`, { username, email, password }).pipe(
      tap(res => this.store(res.token, res.user)),
      map(res => res.user)
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user = null;
    this.userSubject.next(null);
  }

  private store(token: string, user: AuthUser) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.user = user;
    this.userSubject.next(user);
  }
}
