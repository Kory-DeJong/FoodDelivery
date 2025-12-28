import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class OrderTrackerService {
  private readonly storageKey = 'feast_active_order_id';
  private source?: EventSource;
  private currentOrderId: string | null = null;

  constructor(private snack: MatSnackBar, private router: Router, private zone: NgZone) {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.watch(saved);
    }
  }

  watch(orderId: string) {
    if (!orderId) return;
    if (this.currentOrderId === orderId && this.source) return;
    this.currentOrderId = orderId;
    localStorage.setItem(this.storageKey, orderId);
    this.openStream(orderId);
  }

  clear() {
    this.currentOrderId = null;
    localStorage.removeItem(this.storageKey);
    if (this.source) {
      this.source.close();
      this.source = undefined;
    }
  }

  private openStream(orderId: string) {
    if (typeof EventSource === 'undefined') return;
    if (this.source) {
      this.source.close();
      this.source = undefined;
    }
    try {
      this.source = new EventSource(`/api/orders/${orderId}/events`);
      this.source.addEventListener('status', (event: MessageEvent) => {
        const status = event?.data as string;
        this.zone.run(() => this.handleStatus(status));
      });
      this.source.onerror = () => {
        this.source?.close();
        this.source = undefined;
      };
    } catch {
      this.source = undefined;
    }
  }

  private handleStatus(status: string) {
    if (!status) return;
    const label = this.prettyLabel(status);
    const action = this.snack.open(`Order update: ${label}`, 'Track', { duration: 4000 });
    action.onAction().subscribe(() => {
      if (this.currentOrderId) {
        this.router.navigate(['/order', this.currentOrderId]);
      }
    });
    if (status === 'DELIVERED' || status === 'CANCELLED') {
      this.clear();
    }
  }

  private prettyLabel(status: string): string {
    switch (status) {
      case 'PREPARING': return 'Preparing';
      case 'OUT_FOR_DELIVERY': return 'On the way';
      case 'DELIVERED': return 'Delivered';
      case 'PLACED': return 'Order placed';
      default: return status;
    }
  }
}
