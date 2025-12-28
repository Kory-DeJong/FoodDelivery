import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-icon">restaurant</mat-icon>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue ordering delicious food</p>
        </div>

        <mat-card>
          <mat-card-content>
            <form (ngSubmit)="submit()" #f="ngForm">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username or Email</mat-label>
                <input matInput name="username" [(ngModel)]="username" required>
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput name="password" [(ngModel)]="password" required type="password">
                <mat-icon matPrefix>lock</mat-icon>
              </mat-form-field>

              <div *ngIf="error" class="error">
                <mat-icon>error_outline</mat-icon>
                {{ error }}
              </div>

              <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="f.invalid">
                <mat-icon>login</mat-icon>
                Sign In
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(78, 205, 196, 0.05) 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--primary-color);
      margin-bottom: 16px;
    }

    .auth-header h2 {
      margin: 0 0 8px;
      font-size: 2rem;
      color: var(--text-dark);
    }

    .auth-header p {
      margin: 0;
      color: var(--text-light);
      font-size: 1rem;
    }

    mat-card {
      padding: 32px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .submit-btn {
      width: 100%;
      height: 56px !important;
      font-size: 1.1rem !important;
      margin-top: 8px !important;
    }

    .submit-btn mat-icon {
      margin-right: 8px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
    }

    .auth-footer p {
      color: var(--text-light);
      margin: 0;
    }

    .auth-footer a {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  username = 'demo';
  password = '';
  error: string | null = null;
  private redirect = '/';
  constructor(private auth: AuthService, private router: Router, route: ActivatedRoute) {
    route.queryParamMap.subscribe(p => this.redirect = p.get('redirect') || '/');
  }
  submit() {
    this.error = null;
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigateByUrl(this.redirect),
      error: () => this.error = 'Invalid credentials'
    });
  }
}
