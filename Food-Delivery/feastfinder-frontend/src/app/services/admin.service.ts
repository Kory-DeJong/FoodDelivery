import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToppingOption } from './restaurant.service';
import { Order } from './order.service';

export interface DiscountCode {
  code: string;
  type: 'PERCENT' | 'FLAT';
  value: number;
  active: boolean;
}

export interface AdminOverview {
  restaurants: number;
  dishes: number;
  orders: number;
  users: number;
  activeDiscounts: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = '/api/admin';
  constructor(private http: HttpClient) {}

  overview(): Observable<AdminOverview> {
    return this.http.get<AdminOverview>(`${this.base}/overview`);
  }

  listDiscounts(): Observable<DiscountCode[]> {
    return this.http.get<DiscountCode[]>(`${this.base}/discount-codes`);
  }

  createDiscount(payload: Partial<DiscountCode>): Observable<DiscountCode> {
    return this.http.post<DiscountCode>(`${this.base}/discount-codes`, payload);
  }

  updateDiscount(code: string, payload: Partial<DiscountCode>): Observable<DiscountCode> {
    return this.http.put<DiscountCode>(`${this.base}/discount-codes/${code}`, payload);
  }

  listToppings(restaurantId: string): Observable<ToppingOption[]> {
    return this.http.get<ToppingOption[]>(`${this.base}/restaurants/${restaurantId}/toppings`);
  }

  addTopping(restaurantId: string, payload: Partial<ToppingOption>): Observable<ToppingOption[]> {
    return this.http.post<ToppingOption[]>(`${this.base}/restaurants/${restaurantId}/toppings`, payload);
  }

  removeTopping(restaurantId: string, toppingId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/restaurants/${restaurantId}/toppings/${toppingId}`);
  }
}
