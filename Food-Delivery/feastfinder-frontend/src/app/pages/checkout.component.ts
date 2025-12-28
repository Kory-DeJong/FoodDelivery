import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CartService } from '../services/cart.service';
import { OrderService, Order } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { OrderTrackerService } from '../services/order-tracker.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CartItem } from '../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule, MatIconModule, MatDividerModule],
  template: `
  <div class="main">
    <div class="checkout-header">
      <a routerLink="/cart" class="back-link">
        <mat-icon>arrow_back</mat-icon>
        Back to cart
      </a>
      <h2>Checkout</h2>
    </div>

    <div class="checkout-content">
      <div class="checkout-form">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>location_on</mat-icon>
              Delivery Information
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="placeOrder()" #f="ngForm">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Delivery Address</mat-label>
                <input matInput name="address" [(ngModel)]="address" required placeholder="123 Main St, Apt 4B">
                <mat-icon matPrefix>home</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contact Phone</mat-label>
                <input matInput name="phone" [(ngModel)]="phone" required placeholder="+1 (555) 123-4567">
                <mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Delivery Instructions (Optional)</mat-label>
                <textarea matInput name="instructions" [(ngModel)]="instructions" rows="3" placeholder="Ring the doorbell, leave at door, etc."></textarea>
                <mat-icon matPrefix>notes</mat-icon>
              </mat-form-field>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>payment</mat-icon>
              Payment Method
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Payment Method</mat-label>
              <mat-select name="payment" [(ngModel)]="payment">
                <mat-option value="credit-card">
                  <mat-icon>credit_card</mat-icon>
                  Credit Card
                </mat-option>
                <mat-option value="paypal">
                  <mat-icon>account_balance_wallet</mat-icon>
                  PayPal
                </mat-option>
                <mat-option value="cash">
                  <mat-icon>payments</mat-icon>
                  Cash on Delivery
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Promo Code</mat-label>
              <input matInput name="promo" [(ngModel)]="promo" placeholder="WELCOME10 or FIVEOFF">
              <mat-icon matPrefix>local_offer</mat-icon>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>local_offer</mat-icon>
              Discounts & Strategies
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Choose a discount strategy</mat-label>
              <mat-select name="discount" [(ngModel)]="discountStrategy">
                <mat-option *ngFor="let option of discountOptions" [value]="option.id">
                  {{ option.label }} — {{ option.description }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <div class="discount-hint">
              Current savings: $ {{ discountAmount | number:'1.2-2' }}
            </div>
          </mat-card-content>
        </mat-card>

        <div *ngIf="error" class="error">
          <mat-icon>error_outline</mat-icon>
          {{ error }}
        </div>

        <button mat-raised-button color="primary" (click)="placeOrder()" [disabled]="loading || !address || !phone" class="place-order-btn">
          <mat-progress-spinner *ngIf="loading" mode="indeterminate" diameter="20" style="display:inline-block;margin-right:8px"></mat-progress-spinner>
          <mat-icon *ngIf="!loading">check_circle</mat-icon>
          {{ loading ? 'Placing Order...' : 'Place Order' }}
        </button>
      </div>

      <div class="order-summary">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Order Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-items">
              <div class="summary-item" *ngFor="let item of cartItems">
                <div class="summary-line">
                  <span>{{ item.dish.name }} x{{ item.quantity }}</span>
                  <span>$ {{ lineTotal(item) | number:'1.2-2' }}</span>
                </div>
                <div class="summary-extra" *ngFor="let extra of item.extras">
                  <mat-icon>add</mat-icon>
                  <span>{{ extra.name }}</span>
                  <span class="grow"></span>
                  <span>$ {{ (extra.price * item.quantity) | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
            <mat-divider></mat-divider>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>$ {{ subtotal | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row" *ngIf="discountAmount > 0">
              <span>Discount ({{ activeDiscountLabel }})</span>
              <span class="discount">- $ {{ discountAmount | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span class="free">FREE</span>
            </div>
            <div class="summary-row">
              <span>Tax (10%)</span>
              <span>$ {{ taxAmount | number:'1.2-2' }}</span>
            </div>
            <mat-divider></mat-divider>
            <div class="summary-row total">
              <span>Total</span>
              <span>$ {{ grandTotal | number:'1.2-2' }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="secure-checkout">
          <mat-icon>lock</mat-icon>
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .checkout-header {
      margin-bottom: var(--spacing-2xl);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      color: var(--text-dark);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition);
    }

    .back-link:hover {
      color: var(--primary-color);
    }

    .back-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .checkout-header h2 {
      margin: 0;
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 800;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: var(--spacing-xl);
      align-items: start;
    }

    @media (max-width: 968px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .checkout-form mat-card {
      padding: var(--spacing-xl) !important;
      border-radius: var(--radius-lg) !important;
      border: 1px solid var(--border-color) !important;
    }

    .checkout-form mat-card-header {
      margin-bottom: var(--spacing-lg);
      padding: 0 !important;
    }

    .checkout-form mat-card-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      font-size: 1.35rem !important;
      font-weight: 700 !important;
    }

    .checkout-form mat-card-title mat-icon {
      color: var(--primary-color);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .checkout-form mat-card-content {
      padding: 0 !important;
    }

    .checkout-form mat-form-field {
      margin-bottom: var(--spacing-md);
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .place-order-btn {
      width: 100%;
      height: 56px !important;
      font-size: 1.1rem !important;
    }

    .place-order-btn mat-icon {
      margin-right: 8px;
    }

    .order-summary {
      position: sticky;
      top: 80px;
    }

    .order-summary mat-card {
      padding: 24px !important;
    }

    .summary-items {
      margin-bottom: 16px;
    }

    .summary-item {
      padding: 8px 0;
      font-size: 0.95rem;
      color: var(--text-light);
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      font-size: 1rem;
    }

    .summary-row.total {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-dark);
      padding-top: 16px;
    }

    .summary-row .free {
      color: var(--success);
      font-weight: 600;
    }

    .secure-checkout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px;
      background: rgba(46, 204, 113, 0.1);
      border-radius: 8px;
      color: var(--success);
      font-weight: 600;
    }

    .secure-checkout mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .discount-hint {
      margin-top: 8px;
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .summary-extra {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0 4px 16px;
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .summary-extra mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--primary-color);
    }

    .summary-extra .grow {
      flex: 1;
    }

    .summary-row .discount {
      color: var(--danger);
      font-weight: 600;
    }

    @media (max-width: 968px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
      }
    }
  `]
})
export class CheckoutComponent {
  address = '';
  phone = '';
  instructions = '';
  payment = 'credit-card';
  loading = false;
  error: string | null = null;
  promo = '';
  discountStrategy = 'none';
  discountOptions = [
    { id: 'none', label: 'No Discount', description: 'Pay full price', apply: (total: number) => 0 },
    { id: 'percent10', label: '10% off', description: 'Loyalty percentage discount', apply: (total: number) => total * 0.10 },
    { id: 'flat5', label: 'Flat $5 off', description: 'Limited time voucher', apply: () => 5 }
  ];

  get cartItems(): CartItem[] { return this.cart.getItems(); }
  get subtotal() { return this.cart.getTotal(); }
  get discountAmount(): number {
    const option = this.discountOptions.find(o => o.id === this.discountStrategy);
    if (!option) return 0;
    return Math.min(this.subtotal, Math.max(0, option.apply(this.subtotal)));
  }
  get taxableAmount() { return Math.max(0, this.subtotal - this.discountAmount); }
  get taxAmount() { return this.taxableAmount * 0.1; }
  get grandTotal() { return this.taxableAmount + this.taxAmount; }
  get activeDiscountLabel() {
    return this.discountOptions.find(o => o.id === this.discountStrategy)?.label || '';
  }

  constructor(
    private cart: CartService,
    private orders: OrderService,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private tracker: OrderTrackerService
  ) {}

  placeOrder() {
    const items = this.cart.getItems();
    if (items.length === 0) { this.error = 'Cart is empty'; return; }
    this.loading = true;
    this.error = null;

    // Assume userId is a demo user; use restaurant set in cart
    const restaurantIdGuess = this.cart.getRestaurant();
    if (!restaurantIdGuess) { this.error = 'No restaurant selected. Add items from a restaurant menu.'; this.loading = false; return; }
    const request = {
      userId: this.auth.currentUser?.id || 'guest',
      restaurantId: restaurantIdGuess,
      items: items.map(i => ({
        id: i.dish.id,
        quantity: i.quantity,
        extras: i.extras.map(extra => ({ id: extra.id }))
      })),
      deliveryAddress: this.address,
      contactPhone: this.phone,
      instructions: this.instructions?.trim() || undefined,
      paymentMethod: this.payment,
      discountStrategy: this.discountStrategy,
      discountAmount: this.discountAmount,
      promoCode: this.promo.trim() || undefined
    };

    this.orders.create(request).subscribe({
      next: (order) => this.handlePromoThenPayment(order),
      error: (err) => { console.error(err); this.error = 'Failed to place order'; this.loading = false; }
    });
  }

  private handlePromoThenPayment(order: Order) {
    this.applyPromo(order.id).subscribe({
      next: () => this.processPayment(order),
      error: () => this.processPayment(order)
    });
  }

  private processPayment(order: Order) {
    const payload = this.paymentPayload();
    if (!payload) { this.finishOrder(order); return; }
    this.orders.processPayment(order.id, payload).subscribe({
      next: () => this.finishOrder(order),
      error: (err) => {
        console.warn('Payment failed', err);
        this.error = 'Payment failed, defaulting to cash on delivery.';
        this.finishOrder(order);
      }
    });
  }

  private applyPromo(orderId: string): Observable<unknown> {
    const code = this.promo.trim();
    return code ? this.http.post(`/api/orders/${orderId}/promo`, { code }) : of(null);
  }

  private paymentPayload() {
    switch (this.payment) {
      case 'credit-card':
        return { paymentMethod: 'credit-card', cardNumber: '4111111111111111', cardExpiry: '12/29', cardCvv: '123' };
      case 'paypal':
        return { paymentMethod: 'paypal', email: 'demo@feastfinder.com', password: 'demo123' };
      case 'cash':
      default:
        return { paymentMethod: 'cash' };
    }
  }

  private finishOrder(order: Order) {
    this.cart.clear();
    this.loading = false;
    this.tracker.watch(order.id);
    this.router.navigate(['/order', order.id]);
  }
  lineTotal(item: CartItem) { return this.cart.lineTotal(item); }
}
