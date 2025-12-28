import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Order, OrderService } from '../services/order.service';
import { OrderTrackerService } from '../services/order-tracker.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-order-status',
  imports: [CommonModule, RouterModule, MatChipsModule, MatProgressBarModule, MatCardModule, MatIconModule, MatDividerModule],
  template: `
  <div class="main">
    <div class="order-header">
      <a routerLink="/" class="back-link">
        <mat-icon>arrow_back</mat-icon>
        Back to home
      </a>
      <h2>Order Tracking</h2>
    </div>

    <div *ngIf="loading && !order" class="loading-state">
      <mat-icon>delivery_dining</mat-icon>
      <p>Loading order details...</p>
    </div>

    <div *ngIf="error" class="error">
      <mat-icon>error_outline</mat-icon>
      {{ error }}
    </div>

    <div *ngIf="order" class="order-content">
      <mat-card class="order-info">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>receipt</mat-icon>
            Order #{{ order.id }}
          </mat-card-title>
          <mat-card-subtitle>Placed {{ order.orderTime | date:'short' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="info-row">
            <span class="label">Restaurant</span>
            <span class="value">{{ order.restaurantName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Total Amount</span>
            <span class="value price">$ {{ order.totalAmount | number:'1.2-2' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Delivery Address</span>
            <span class="value">{{ order.deliveryAddress }}</span>
          </div>
          <div class="info-row">
            <span class="label">Contact</span>
            <span class="value">{{ order.contactPhone }}</span>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="order-tracking">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>local_shipping</mat-icon>
            Delivery Status
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-timeline">
            <div class="status-step" [class.active]="isStatusActive('PLACED', order.status)" [class.completed]="isStatusCompleted('PLACED', order.status)">
              <div class="step-icon">
                <mat-icon>{{ isStatusCompleted('PLACED', order.status) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
              </div>
              <div class="step-content">
                <h4>Order Placed</h4>
                <p>Your order has been received</p>
              </div>
            </div>

            <div class="status-step" [class.active]="isStatusActive('PREPARING', order.status)" [class.completed]="isStatusCompleted('PREPARING', order.status)">
              <div class="step-icon">
                <mat-icon>{{ isStatusCompleted('PREPARING', order.status) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
              </div>
              <div class="step-content">
                <h4>Preparing</h4>
                <p>Restaurant is preparing your food</p>
              </div>
            </div>

            <div class="status-step" [class.active]="isStatusActive('OUT_FOR_DELIVERY', order.status)" [class.completed]="isStatusCompleted('OUT_FOR_DELIVERY', order.status)">
              <div class="step-icon">
                <mat-icon>{{ isStatusCompleted('OUT_FOR_DELIVERY', order.status) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
              </div>
              <div class="step-content">
                <h4>Out for Delivery</h4>
                <p>Your order is on the way</p>
              </div>
            </div>

            <div class="status-step" [class.active]="isStatusActive('DELIVERED', order.status)" [class.completed]="isStatusCompleted('DELIVERED', order.status)">
              <div class="step-icon">
                <mat-icon>{{ isStatusCompleted('DELIVERED', order.status) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
              </div>
              <div class="step-content">
                <h4>Delivered</h4>
                <p>Enjoy your meal!</p>
              </div>
            </div>
          </div>

          <div class="current-status">
            <mat-chip [class]="'status-' + order.status.toLowerCase()">
              {{ label(order.status) }}
            </mat-chip>
          </div>

          <mat-progress-bar [value]="progress(order.status)" mode="determinate" class="status-progress"></mat-progress-bar>

          <div class="estimated-time" *ngIf="order.status !== 'DELIVERED'">
            <mat-icon>schedule</mat-icon>
            <span>Estimated delivery: 25-35 minutes</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  </div>
  `,
  styles: [`
    .order-header {
      margin-bottom: 32px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: var(--text-dark);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: var(--primary-color);
    }

    .back-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .order-header h2 {
      margin: 0;
      font-size: 2rem;
    }

    .loading-state {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-light);
    }

    .loading-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--primary-color);
      margin-bottom: 16px;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .order-content {
      display: grid;
      grid-template-columns: 400px 1fr;
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
      text-align: right;
    }

    .info-row .price {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .status-timeline {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 32px;
      position: relative;
      padding-left: 40px;
    }

    .status-timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 20px;
      bottom: 20px;
      width: 2px;
      background: rgba(0,0,0,0.1);
    }

    .status-step {
      position: relative;
      opacity: 0.4;
      transition: opacity 0.3s ease;
    }

    .status-step.active,
    .status-step.completed {
      opacity: 1;
    }

    .step-icon {
      position: absolute;
      left: -40px;
      top: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 50%;
    }

    .step-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: rgba(0,0,0,0.2);
    }

    .status-step.active .step-icon mat-icon {
      color: var(--primary-color);
    }

    .status-step.completed .step-icon mat-icon {
      color: var(--success);
    }

    .step-content h4 {
      margin: 0 0 4px;
      font-size: 1.1rem;
      color: var(--text-dark);
    }

    .step-content p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-light);
    }

    .current-status {
      text-align: center;
      margin-bottom: 16px;
    }

    .current-status mat-chip {
      font-size: 1rem;
      padding: 8px 20px;
      height: auto;
    }

    .status-placed {
      background: rgba(52, 152, 219, 0.1) !important;
      color: #3498db !important;
    }

    .status-preparing {
      background: rgba(241, 196, 15, 0.1) !important;
      color: #f1c40f !important;
    }

    .status-out_for_delivery {
      background: rgba(155, 89, 182, 0.1) !important;
      color: #9b59b6 !important;
    }

    .status-delivered {
      background: rgba(46, 204, 113, 0.1) !important;
      color: var(--success) !important;
    }

    .status-progress {
      height: 8px !important;
      border-radius: 4px;
      margin-bottom: 24px;
    }

    .estimated-time {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background: rgba(255, 107, 53, 0.05);
      border-radius: 8px;
      color: var(--primary-color);
      font-weight: 600;
    }

    @media (max-width: 968px) {
      .order-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  id = '';
  order: Order | null = null;
  loading = false;
  error: string | null = null;
  private timer: any;
  private eventSource?: EventSource;

  constructor(private route: ActivatedRoute, private api: OrderService, private snack: MatSnackBar, private tracker: OrderTrackerService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.tracker.watch(this.id);
    }
    this.fetch();
    this.timer = setInterval(() => this.fetch(), 4000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.eventSource?.close();
  }

  private fetch() {
    if (!this.id) return;
    this.loading = true;
    this.api.get(this.id).subscribe({
      next: o => {
        const prevStatus = this.order?.status;
        this.order = o;
        this.loading = false;
        if (prevStatus && prevStatus !== o.status) this.notify(o.status);
        this.connectSse();
      },
      error: () => { this.error = 'Failed to fetch order'; this.loading = false; }
    });
  }

  progress(status: Order['status']): number {
    switch (status) {
      case 'PLACED': return 25;
      case 'PREPARING': return 50;
      case 'OUT_FOR_DELIVERY': return 75;
      case 'DELIVERED': return 100;
      default: return 0;
    }
  }

  label(status: Order['status']): string {
    switch (status) {
      case 'PLACED': return 'Order Placed';
      case 'PREPARING': return 'Preparing';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      default: return status;
    }
  }

  isStatusActive(checkStatus: Order['status'], currentStatus: Order['status']): boolean {
    const statuses: Order['status'][] = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const checkIndex = statuses.indexOf(checkStatus);
    const currentIndex = statuses.indexOf(currentStatus);
    return checkIndex === currentIndex;
  }

  isStatusCompleted(checkStatus: Order['status'], currentStatus: Order['status']): boolean {
    const statuses: Order['status'][] = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const checkIndex = statuses.indexOf(checkStatus);
    const currentIndex = statuses.indexOf(currentStatus);
    return checkIndex < currentIndex;
  }

  private connectSse() {
    if (!this.id || this.eventSource || typeof EventSource === 'undefined') return;
    try {
      this.eventSource = new EventSource(`/api/orders/${this.id}/events`);
      this.eventSource.addEventListener('status', (event: MessageEvent) => {
        const data = event?.data as Order['status'];
        if (this.order && data && this.order.status !== data) {
          this.order.status = data;
          this.notify(data);
        }
      });
      this.eventSource.onerror = () => {
        this.eventSource?.close();
        this.eventSource = undefined;
      };
    } catch {
      this.eventSource = undefined;
    }
  }

  private notify(status: Order['status']) {
    this.snack.open(`Order status updated: ${this.label(status)}`, 'Close', { duration: 2500 });
  }
}
