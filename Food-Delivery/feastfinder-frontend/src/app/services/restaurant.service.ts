import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dish {
  id: string;
  name: string;
  description: string;
  type: 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE';
  price: number;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  compatibleTypes?: Dish['type'][];
  removable?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  rating?: number;
  cuisineType?: string;
  primaryType?: Dish['type'];
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private base = '/api/restaurants';
  constructor(private http: HttpClient) {}

  list(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.base);
  }

  get(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.base}/${id}`);
  }

  menu(id: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.base}/${id}/menu`);
  }

  toppings(id: string): Observable<ToppingOption[]> {
    return this.http.get<ToppingOption[]>(`${this.base}/${id}/toppings`);
  }

  create(payload: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.base, payload);
  }

  addDish(restaurantId: string, payload: Partial<Dish>): Observable<any> {
    return this.http.post(`${this.base}/${restaurantId}/dishes`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
