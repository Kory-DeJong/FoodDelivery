import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface OrderItemExtraPayload { id: string; }

export interface CreateOrderItem { id: string; quantity: number; extras?: OrderItemExtraPayload[]; }
export interface CreateOrderRequest {
  userId: string;
  restaurantId: string;
  items: CreateOrderItem[];
  deliveryAddress: string;
  contactPhone: string;
  instructions?: string;
  paymentMethod?: string;
  discountStrategy?: string;
  discountAmount?: number;
  promoCode?: string;
}

export interface Order {
  id: string;
  status: 'PLACED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED';
  totalAmount: number;
  orderTime: string;
  restaurantName: string;
  deliveryAddress: string;
  contactPhone: string;
  discountAmount?: number;
  discountStrategy?: string;
  paymentMethod?: string;
  promoCode?: string;
  userId?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = '/api/orders';
  constructor(private http: HttpClient) {}

  create(req: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.base, req);
  }

  get(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  list(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  updateStatus(id: string, status: Order['status']): Observable<any> {
    return this.http.put(`${this.base}/${id}/status`, { status });
  }

  processPayment(orderId: string, payload: any): Observable<any> {
    return this.http.post(`${this.base}/${orderId}/payment`, payload);
  }
}
