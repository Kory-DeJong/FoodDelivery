import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartService, CartItem } from '../services/cart.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, MatListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule, MatDividerModule, MatChipsModule],
  template: `
  <div class="main">
    <div class="cart-header">
      <a routerLink="/" class="back-link">
        <mat-icon>arrow_back</mat-icon>
        Continue shopping
      </a>
      <h2>Shopping Cart</h2>
    </div>

    <div *ngIf="items.length === 0" class="empty-cart">
      <mat-icon>shopping_cart</mat-icon>
      <h3>Your cart is empty</h3>
      <p>Add some delicious items to get started!</p>
      <button mat-raised-button color="primary" routerLink="/">Browse Restaurants</button>
    </div>

    <div *ngIf="items.length > 0" class="cart-content">
      <div class="cart-items">
        <mat-card *ngFor="let i of items" class="cart-item">
          <div class="item-details">
            <div class="item-info">
              <h3>{{ i.dish.name }}</h3>
              <p class="item-type">{{ i.dish.type }}</p>
              <div class="item-price">Base: $ {{ i.dish.price | number:'1.2-2' }} each</div>
              <div class="extras" *ngIf="i.extras.length; else noExtras">
                <mat-chip-set>
                  <mat-chip *ngFor="let extra of i.extras">
                    {{ extra.name }}
                    <span class="price">+ $ {{ extra.price | number:'1.2-2' }}</span>
                  </mat-chip>
                </mat-chip-set>
              </div>
              <ng-template #noExtras>
                <div class="extras none">No add-ons selected</div>
              </ng-template>
            </div>
            <div class="item-actions">
              <div class="quantity-control">
                <button mat-icon-button (click)="decrement(i.lineId)">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="quantity">{{ i.quantity }}</span>
                <button mat-icon-button (click)="increment(i.lineId)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <div class="item-total">$ {{ lineTotal(i) | number:'1.2-2' }}</div>
              <button mat-icon-button color="warn" (click)="remove(i.lineId)" class="remove-btn">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="cart-summary">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Order Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>$ {{ total | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span class="free">FREE</span>
            </div>
            <div class="summary-row">
              <span>Tax (10%)</span>
              <span>$ {{ (total * 0.1) | number:'1.2-2' }}</span>
            </div>
            <mat-divider></mat-divider>
            <div class="summary-row total">
              <span>Total</span>
              <span>$ {{ (total * 1.1) | number:'1.2-2' }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="checkout()" class="checkout-btn">
              <mat-icon>payment</mat-icon>
              Proceed to Checkout
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .cart-header {
      margin-bottom: var(--spacing-xl);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
      color: var(--text-medium);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-fast);
    }

    .back-link:hover {
      color: var(--primary-color);
    }

    .back-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .cart-header h2 {
      margin: 0;
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      color: var(--text-dark);
    }

    .empty-cart {
      text-align: center;
      padding: var(--spacing-2xl) var(--spacing-lg);
      background: var(--bg-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .empty-cart mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--text-light);
      margin-bottom: 24px;
    }

    .empty-cart h3 {
      margin: 0 0 12px;
      color: var(--text-dark);
    }

    .empty-cart p {
      margin: 0 0 24px;
      color: var(--text-light);
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: var(--spacing-xl);
      align-items: start;
    }

    @media (max-width: 968px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .cart-item {
      padding: var(--spacing-lg) !important;
      transition: var(--transition);
    }

    .cart-item:hover {
      box-shadow: var(--shadow-md) !important;
    }

    .item-details {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--spacing-xl);
    }

    @media (max-width: 640px) {
      .item-details {
        flex-direction: column;
        gap: var(--spacing-md);
      }
    }

    .item-info {
      flex: 1;
    }

    .item-info h3 {
      margin: 0 0 var(--spacing-xs);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-dark);
    }

    .item-type {
      margin: 0 0 var(--spacing-sm);
      font-size: 0.875rem;
      color: var(--text-light);
      text-transform: capitalize;
    }

    .item-price {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-medium);
      margin-bottom: var(--spacing-sm);
    }

    .extras {
      margin-top: var(--spacing-sm);
    }

    .extras.none {
      font-size: 0.85rem;
      font-style: italic;
      color: var(--text-light);
    }

    .extras mat-chip {
      background: rgba(255, 107, 53, 0.1) !important;
      color: var(--primary-color) !important;
      font-weight: 500 !important;
      margin: var(--spacing-xs) var(--spacing-sm) 0 0;
    }

    .extras .price {
      font-size: 0.75rem;
      margin-left: var(--spacing-xs);
      font-weight: 600;
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--spacing-md);
    }

    @media (max-width: 640px) {
      .item-actions {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: var(--bg-light);
      border-radius: var(--radius-md);
      padding: var(--spacing-xs);
      border: 1px solid var(--border-color);
    }

    .quantity-control button {
      width: 32px;
      height: 32px;
    }

    .quantity {
      min-width: 32px;
      text-align: center;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .item-total {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
      min-width: 100px;
      text-align: right;
    }

    .remove-btn {
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .remove-btn:hover {
      opacity: 1;
    }

    .cart-summary {
      position: sticky;
      top: 80px;
    }

    @media (max-width: 968px) {
      .cart-summary {
        position: static;
      }
    }

    .cart-summary mat-card {
      padding: var(--spacing-xl) !important;
    }

    .cart-summary mat-card-title {
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      color: var(--text-dark) !important;
      margin-bottom: var(--spacing-lg) !important;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) 0;
      font-size: 1rem;
      color: var(--text-medium);
    }

    .summary-row.total {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-dark);
      padding-top: var(--spacing-lg);
    }

    .summary-row .free {
      color: var(--success);
      font-weight: 700;
      font-size: 0.95rem;
    }

    mat-divider {
      margin: var(--spacing-lg) 0 !important;
    }

    .checkout-btn {
      width: 100%;
      height: 56px !important;
      font-size: 1.1rem !important;
      font-weight: 700 !important;
      margin-top: var(--spacing-lg) !important;
    }

    .checkout-btn mat-icon {
      margin-right: var(--spacing-sm);
    }

    @media (max-width: 600px) {
      .item-details {
        flex-direction: column;
        align-items: flex-start;
      }

      .item-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class CartComponent {
  items: CartItem[] = [];
  total = 0;
  constructor(private cart: CartService, private router: Router) {
    this.refresh();
  }
  private refresh() { this.items = this.cart.getItems(); this.total = this.cart.getTotal(); }
  qty(lineId: string, v: number) { this.cart.setQuantity(lineId, Number(v)); this.refresh(); }
  increment(lineId: string) { const item = this.items.find(i => i.lineId === lineId); if (item) this.qty(lineId, item.quantity + 1); }
  decrement(lineId: string) { const item = this.items.find(i => i.lineId === lineId); if (item && item.quantity > 1) this.qty(lineId, item.quantity - 1); }
  remove(lineId: string) { this.cart.remove(lineId); this.refresh(); }
  lineTotal(item: CartItem) { return this.cart.lineTotal(item); }
  checkout() { this.router.navigateByUrl('/checkout'); }
}
