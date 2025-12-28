import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { Dish } from './restaurant.service';

export interface CartExtra { id: string; name: string; price: number; }
export interface CartItem { dish: Dish; quantity: number; extras: CartExtra[]; lineId: string; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'feast_cart_v1';
  private items: CartItem[] = [];
  private restKey = 'feast_cart_restaurant';
  private restaurantId: string | null = null;
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  constructor() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      try {
        const parsed: Partial<CartItem>[] = JSON.parse(raw) || [];
        this.items = parsed.map(item => this.normalizeItem(item));
      } catch {
        this.items = [];
      }
    }
    this.restaurantId = localStorage.getItem(this.restKey);
    this.itemsSubject.next([...this.items]);
  }

  getItems(): CartItem[] { return this.items.map(i => ({ ...i, dish: { ...i.dish }, extras: i.extras.map(e => ({ ...e })) })); }
  getCount(): number { return this.items.reduce((a, b) => a + b.quantity, 0); }
  getTotal(): number { return this.items.reduce((total, item) => total + this.lineTotal(item), 0); }

  add(dish: Dish, qty = 1, extras: CartExtra[] = []) {
    const lineId = this.makeLineId(dish.id, extras);
    const found = this.items.find(i => i.lineId === lineId);
    if (found) {
      found.quantity += qty;
    } else {
      this.items.push({ dish, quantity: qty, extras: extras.map(e => ({ ...e })), lineId });
    }
    this.persist();
  }

  setQuantity(lineId: string, qty: number) {
    const item = this.items.find(i => i.lineId === lineId);
    if (!item) return;
    item.quantity = Math.max(1, qty);
    this.persist();
  }

  remove(lineId: string) {
    this.items = this.items.filter(i => i.lineId !== lineId);
    this.persist();
  }

  clear() { this.items = []; this.persist(); }

  private persist() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
    this.itemsSubject.next([...this.items]);
  }

  setRestaurant(id: string) { this.restaurantId = id; localStorage.setItem(this.restKey, id); }
  getRestaurant(): string | null { return this.restaurantId; }

  lineTotal(item: CartItem): number {
    const extrasTotal = item.extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
    return (item.dish.price + extrasTotal) * item.quantity;
  }

  private makeLineId(dishId: string, extras: CartExtra[]): string {
    const suffix = extras.map(e => e.id).sort().join('|');
    return `${dishId}::${suffix}`;
  }

  private normalizeItem(item: Partial<CartItem>): CartItem {
    const extras = (item.extras || []).map(e => ({ id: e.id, name: e.name, price: e.price } as CartExtra));
    const dish = item.dish as Dish;
    const dishId = dish?.id || 'unknown';
    const lineId = item.lineId || this.makeLineId(dishId, extras);
    return {
      dish,
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      extras,
      lineId
    };
  }
}
