import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderTrackerService } from './services/order-tracker.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
  <mat-toolbar color="primary" class="mat-elevation-z2">
    <button mat-button routerLink="/" class="brand"><mat-icon>restaurant</mat-icon>&nbsp;FeastFinder</button>
    <span class="spacer"></span>
    <button mat-button routerLink="/">Home</button>
    <button mat-button routerLink="/cart" class="cart-btn">
      <mat-icon>shopping_cart</mat-icon>&nbsp;Cart
      <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
    </button>
    <button *ngIf="isAuthed" mat-button routerLink="/profile"><mat-icon>person</mat-icon>&nbsp;Profile</button>
    <button *ngIf="isAdmin" mat-button routerLink="/admin"><mat-icon>admin_panel_settings</mat-icon>&nbsp;Admin</button>
    <button *ngIf="!isAuthed" mat-button routerLink="/login"><mat-icon>login</mat-icon>&nbsp;Login</button>
    <button *ngIf="!isAuthed" mat-button routerLink="/register"><mat-icon>person_add</mat-icon>&nbsp;Register</button>
    <button *ngIf="isAuthed" mat-button (click)="logout()"><mat-icon>logout</mat-icon>&nbsp;Logout</button>
  </mat-toolbar>
  <main class="main"><router-outlet /></main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  cartCount = 0;
  get isAuthed() { return this.auth.isAuthenticated(); }
  get isAdmin() { return this.auth.hasRole('ROLE_ADMIN'); }

  constructor(
    private cart: CartService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tracker: OrderTrackerService
  ) {}

  ngOnInit() {
    // Subscribe to cart changes
    this.cart.items$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  logout() {
    this.auth.logout();
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
    this.router.navigate(['/']);
  }
}
