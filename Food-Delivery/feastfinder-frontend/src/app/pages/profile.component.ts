import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Address { id: string; label: string; line1: string; line2?: string; city: string; postalCode: string; country: string; isDefault: boolean; }

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule],
  template: `
    <div class="main">
      <div class="profile-header">
        <h2>My Profile</h2>
      </div>

      <div class="profile-content">
        <mat-card class="user-info">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person</mat-icon>
              Account Information
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <span class="label">Username</span>
              <span class="value">demo</span>
            </div>
            <div class="info-row">
              <span class="label">Email</span>
              <span class="value">demo&#64;feastfinder.com</span>
            </div>
            <div class="info-row">
              <span class="label">Member Since</span>
              <span class="value">January 2024</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="addresses-section">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>location_on</mat-icon>
              Saved Addresses
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="addresses.length === 0" class="empty-state">
              <mat-icon>add_location</mat-icon>
              <p>No saved addresses yet</p>
            </div>

            <div class="address-list">
              <mat-card *ngFor="let a of addresses" class="address-card">
                <div class="address-content">
                  <div class="address-info">
                    <div class="address-label">
                      <mat-icon>{{ a.label === 'Home' ? 'home' : a.label === 'Work' ? 'work' : 'location_on' }}</mat-icon>
                      <strong>{{ a.label }}</strong>
                      <span class="default-badge" *ngIf="a.isDefault">Default</span>
                    </div>
                    <div class="address-details">
                      <p>{{ a.line1 }}</p>
                      <p *ngIf="a.line2">{{ a.line2 }}</p>
                      <p>{{ a.city }}, {{ a.postalCode }}</p>
                      <p>{{ a.country }}</p>
                    </div>
                  </div>
                  <button mat-icon-button color="warn" (click)="remove(a.id)" class="remove-btn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card>
            </div>

            <mat-divider></mat-divider>

            <div class="add-address-section">
              <h3>
                <mat-icon>add_circle</mat-icon>
                Add New Address
              </h3>
              <form (ngSubmit)="add()" #f="ngForm" class="address-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Label</mat-label>
                  <input matInput name="label" [(ngModel)]="form.label" placeholder="Home, Work, etc.">
                  <mat-icon matPrefix>label</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Address Line 1</mat-label>
                  <input matInput name="line1" [(ngModel)]="form.line1" required placeholder="Street address">
                  <mat-icon matPrefix>home</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Address Line 2 (Optional)</mat-label>
                  <input matInput name="line2" [(ngModel)]="form.line2" placeholder="Apt, Suite, etc.">
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput name="city" [(ngModel)]="form.city" required>
                    <mat-icon matPrefix>location_city</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Postal Code</mat-label>
                    <input matInput name="postalCode" [(ngModel)]="form.postalCode">
                    <mat-icon matPrefix>markunread_mailbox</mat-icon>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Country</mat-label>
                  <input matInput name="country" [(ngModel)]="form.country" placeholder="United States">
                  <mat-icon matPrefix>public</mat-icon>
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit" [disabled]="f.invalid" class="add-btn">
                  <mat-icon>add</mat-icon>
                  Add Address
                </button>
              </form>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-header {
      margin-bottom: 32px;
    }

    .profile-header h2 {
      margin: 0;
      font-size: 2rem;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 24px;
      align-items: start;
    }

    mat-card {
      padding: 24px !important;
    }

    mat-card-header {
      margin-bottom: 24px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem !important;
    }

    mat-card-title mat-icon {
      color: var(--primary-color);
    }

    .user-info {
      position: sticky;
      top: 80px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      color: var(--text-light);
      font-weight: 500;
    }

    .info-row .value {
      color: var(--text-dark);
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }

    .address-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .address-card {
      padding: 16px !important;
      background: var(--bg-light);
      box-shadow: none !important;
      border: 1px solid rgba(0,0,0,0.08);
    }

    .address-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .address-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .address-label mat-icon {
      color: var(--primary-color);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .address-label strong {
      font-size: 1.1rem;
      color: var(--text-dark);
    }

    .default-badge {
      background: var(--primary-color);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .address-details p {
      margin: 4px 0;
      color: var(--text-light);
      font-size: 0.95rem;
    }

    .remove-btn {
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .remove-btn:hover {
      opacity: 1;
    }

    .add-address-section {
      margin-top: 24px;
    }

    .add-address-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 20px;
      color: var(--text-dark);
    }

    .add-address-section h3 mat-icon {
      color: var(--primary-color);
    }

    .address-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .add-btn {
      width: 100%;
      height: 48px !important;
      margin-top: 8px !important;
    }

    .add-btn mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 968px) {
      .profile-content {
        grid-template-columns: 1fr;
      }

      .user-info {
        position: static;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent {
  addresses: Address[] = [];
  form: any = { label: 'Home', line1: '', line2: '', city: '', postalCode: '', country: '' };
  constructor(private http: HttpClient) { this.load(); }
  load() { this.http.get<Address[]>('/api/user/addresses').subscribe(l => this.addresses = l); }
  add() { this.http.post<Address>('/api/user/addresses', this.form).subscribe(() => { this.form = { label: 'Home' }; this.load(); }); }
  remove(id: string) { this.http.delete(`/api/user/addresses/${id}`).subscribe(() => this.load()); }
}

