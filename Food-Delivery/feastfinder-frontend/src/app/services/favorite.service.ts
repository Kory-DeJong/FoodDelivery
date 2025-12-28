import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface FavoriteRestaurant { id: number; restaurantId: string; }

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private base = '/api/user/favorites/restaurants';
  constructor(private http: HttpClient) {}
  list(): Observable<Set<string>> {
    return this.http.get<FavoriteRestaurant[]>(this.base).pipe(map(arr => new Set(arr.map(a => a.restaurantId))));
  }
  add(restaurantId: string) { return this.http.post(this.base, { restaurantId }); }
  remove(restaurantId: string) { return this.http.delete(`${this.base}/${restaurantId}`); }
}

