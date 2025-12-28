import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dish, Restaurant, RestaurantService, ToppingOption } from '../services/restaurant.service';
import { CartExtra, CartService } from '../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule, MatChipSelectionChange } from '@angular/material/chips';
import { MockDataService } from '../services/mock-data.service';

@Component({
  standalone: true,
  selector: 'app-restaurant-menu',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatSnackBarModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule],
  template: `
  <div class="banner" *ngIf="restaurant" [style.backgroundImage]="'url(' + (restaurant.image || placeholder) + ')'">
    <div class="overlay">
      <a routerLink="/" class="back">
        <mat-icon>arrow_back</mat-icon>
        Back to restaurants
      </a>
      <div class="restaurant-info">
        <h2>{{ restaurant.name }}</h2>
        <p>{{ restaurant.description }}</p>
        <div class="meta">
          <span class="tag">{{ restaurant.cuisineType }}</span>
          <span class="rating"><mat-icon>star</mat-icon> {{ restaurant.rating }}</span>
          <span><mat-icon>schedule</mat-icon> 25-35 min</span>
          <span><mat-icon>delivery_dining</mat-icon> Free delivery</span>
        </div>
      </div>
    </div>
  </div>

  <div class="main">
    <div class="menu-header">
      <h2>Menu</h2>
      <div class="cart-summary" *ngIf="cartCount > 0" (click)="goToCart()">
        <mat-icon>shopping_cart</mat-icon>
        <span>{{ cartCount }} items</span>
        <button mat-raised-button color="primary">View Cart</button>
      </div>
    </div>

    <div *ngIf="loading" class="loading-state">
      <mat-icon>restaurant_menu</mat-icon>
      <p>Loading delicious menu items...</p>
    </div>

    <div *ngIf="error" class="error">
      <mat-icon>error_outline</mat-icon>
      {{ error }}
    </div>

    <div class="menu-grid" *ngIf="!loading">
      <mat-card *ngFor="let d of menu" class="dish-card">
        <div class="dish-content">
          <div class="dish-info">
            <mat-card-title>{{ d.name }}</mat-card-title>
            <mat-card-subtitle>
              <span class="dish-type" [class.veg]="d.type === 'VEGETARIAN'" [class.non-veg]="d.type === 'NON_VEGETARIAN'">
                <mat-icon>{{ d.type === 'VEGETARIAN' ? 'eco' : 'restaurant' }}</mat-icon>
                {{ d.type === 'VEGETARIAN' ? 'Vegetarian' : 'Non-Veg' }}
              </span>
            </mat-card-subtitle>
            <mat-card-content>
              <p>{{ d.description }}</p>
              <div class="extras-section" *ngIf="availableExtras(d).length > 0">
                <div class="extras-label">Add-ons</div>
                <mat-chip-listbox multiple class="extras-chips" aria-label="Toppings">
                  <mat-chip-option *ngFor="let topping of availableExtras(d)"
                                   [selected]="isExtraSelected(d.id, topping.id)"
                                   (selectionChange)="onExtraSelection($event, d.id, topping)">
                    {{ topping.name }}
                    <span class="price">+ $ {{ topping.price | number:'1.2-2' }}</span>
                  </mat-chip-option>
                </mat-chip-listbox>
                <div class="extras-summary" *ngIf="selectedExtrasLabel(d.id)">
                  Selected: {{ selectedExtrasLabel(d.id) }}
                </div>
              </div>
            </mat-card-content>
          </div>
        </div>
        <mat-card-actions class="dish-actions">
          <div class="price">$ {{ (d.price + extrasUpsell(d.id)) | number:'1.2-2' }}</div>
          <button mat-raised-button color="primary" (click)="addToCart(d)">
            <mat-icon>add_shopping_cart</mat-icon>
            Add to Cart
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  </div>

  <!-- Floating Cart Button -->
  <div class="floating-cart" *ngIf="cartCount > 0" (click)="goToCart()">
    <mat-icon>shopping_cart</mat-icon>
    <span class="cart-badge">{{ cartCount }}</span>
  </div>
  `,
  styles: [`
    .banner {
      height: 350px;
      margin: 0;
      border-radius: 0;
    }

    @media (max-width: 768px) {
      .banner {
        height: 280px;
      }
    }

    .back {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 1rem;
      font-weight: 600;
    }

    .back mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .restaurant-info h2 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      margin-bottom: var(--spacing-md);
      font-weight: 800;
    }

    .restaurant-info p {
      font-size: clamp(1rem, 2vw, 1.1rem);
      margin-bottom: var(--spacing-lg);
      line-height: 1.6;
    }

    .meta {
      display: flex;
      gap: var(--spacing-xl);
      align-items: center;
      flex-wrap: wrap;
    }

    .meta span {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.95rem;
      white-space: nowrap;
    }

    .meta mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .rating {
      color: var(--warning);
      font-weight: 700;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-xl) 0 var(--spacing-lg);
      border-bottom: 2px solid var(--border-color);
    }

    @media (max-width: 640px) {
      .menu-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }
    }

    .menu-header h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
    }

    .cart-summary {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--bg-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: var(--transition);
    }

    .cart-summary:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }

    .cart-summary mat-icon {
      color: var(--primary-color);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .cart-summary span {
      font-weight: 700;
      color: var(--text-dark);
      font-size: 1rem;
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
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: var(--spacing-xl);
      margin-bottom: 100px;
    }

    @media (max-width: 768px) {
      .menu-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }
    }

    .dish-card {
      transition: var(--transition);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg) !important;
    }

    .dish-card:hover {
      box-shadow: var(--shadow-hover) !important;
      transform: translateY(-4px);
      border-color: var(--primary-light);
    }

    .dish-content {
      display: flex;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg) !important;
    }

    .dish-info {
      flex: 1;
    }

    .dish-info mat-card-title {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      margin-bottom: var(--spacing-sm) !important;
    }

    .dish-info mat-card-content {
      padding: 0 !important;
      margin-top: var(--spacing-md) !important;
    }

    .dish-info mat-card-content p {
      color: var(--text-medium);
      line-height: 1.6;
      margin-bottom: var(--spacing-md);
    }

    .dish-image {
      width: 120px;
      height: 120px;
      border-radius: var(--radius-md);
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
    }

    .dish-type {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .dish-type.veg {
      background: rgba(46, 204, 113, 0.15);
      color: var(--success);
    }

    .dish-type.non-veg {
      background: rgba(231, 76, 60, 0.15);
      color: var(--danger);
    }

    .dish-type mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .dish-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg) !important;
      border-top: 1px solid var(--border-color);
      gap: var(--spacing-md);
    }

    .dish-actions button {
      white-space: nowrap;
    }

    .dish-actions button mat-icon {
      margin-right: var(--spacing-xs);
    }

    .price {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
    }

    .extras-section {
      margin-top: var(--spacing-lg);
      padding: var(--spacing-md);
      background: var(--bg-light);
      border-radius: var(--radius-md);
    }

    .extras-label {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-dark);
      margin-bottom: var(--spacing-sm);
    }

    .extras-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .extras-chips mat-chip-option {
      background: rgba(255, 107, 53, 0.08);
      color: var(--primary-color);
    }

    .extras-summary {
      margin-top: 6px;
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .floating-cart {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .floating-cart:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(255, 107, 53, 0.5);
    }

    .floating-cart mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: white;
      color: var(--primary-color);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .menu-grid {
        grid-template-columns: 1fr;
      }

      .cart-summary {
        display: none;
      }
    }
  `]
})
export class RestaurantMenuComponent implements OnInit {
  restaurant: Restaurant | null = null;
  menu: Dish[] = [];
  toppings: ToppingOption[] = [];
  loading = false;
  error: string | null = null;
  cartCount = 0;
  placeholder = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60';
  private selectedExtras = new Map<string, Set<string>>();

  private id = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: RestaurantService,
    private cart: CartService,
    private snack: MatSnackBar,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.id = p.get('id') || '';
      if (!this.id) { this.router.navigateByUrl('/'); return; }
      this.load();
    });
    this.cart.items$.subscribe(() => this.cartCount = this.cart.getCount());
    this.cartCount = this.cart.getCount();
  }

  private load() {
    this.loading = true;
    this.selectedExtras.clear();
    this.api.get(this.id).subscribe({ next: r => this.restaurant = r, error: () => {} });
    this.api.menu(this.id).subscribe({
      next: d => { this.menu = d; this.loading = false; },
      error: () => {
        this.error = 'Backend not reachable, showing sample menu';
        this.menu = this.mockData.getDishesForRestaurant(this.id);
        this.loading = false;
      }
    });
    this.api.toppings(this.id).subscribe({
      next: t => this.toppings = t,
      error: () => { this.toppings = this.mockData.getToppingsForRestaurant(this.id); }
    });
  }

  addToCart(dish: Dish) {
    this.cart.setRestaurant(this.id);
    this.cart.add(dish, 1, this.getSelectedExtras(dish.id));
    this.selectedExtras.delete(dish.id);
    this.cartCount = this.cart.getCount();
    this.snack.open(`${dish.name} added to cart`, 'Close', { duration: 1500 });
  }

  goToCart() { this.router.navigateByUrl('/cart'); }

  availableExtras(dish: Dish): ToppingOption[] {
    return this.toppings.filter(t => !t.compatibleTypes || t.compatibleTypes.includes(dish.type));
  }

  onExtraSelection(event: MatChipSelectionChange, dishId: string, topping: ToppingOption) {
    if (event.selected) this.addExtra(dishId, topping.id);
    else this.removeExtra(dishId, topping.id);
  }

  private addExtra(dishId: string, toppingId: string) {
    let set = this.selectedExtras.get(dishId);
    if (!set) { set = new Set<string>(); this.selectedExtras.set(dishId, set); }
    set.add(toppingId);
  }

  private removeExtra(dishId: string, toppingId: string) {
    const set = this.selectedExtras.get(dishId);
    if (!set) return;
    set.delete(toppingId);
  }

  isExtraSelected(dishId: string, toppingId: string): boolean {
    return this.selectedExtras.get(dishId)?.has(toppingId) ?? false;
  }

  selectedExtrasLabel(dishId: string): string {
    const ids = Array.from(this.selectedExtras.get(dishId) || []);
    if (!ids.length) return '';
    const names = ids.map(id => this.toppings.find(t => t.id === id)?.name).filter(Boolean);
    return names.join(', ');
  }

  extrasUpsell(dishId: string): number {
    return this.getSelectedExtras(dishId).reduce((sum, extra) => sum + (extra.price || 0), 0);
  }

  private getSelectedExtras(dishId: string): CartExtra[] {
    const ids = Array.from(this.selectedExtras.get(dishId) || []);
    const extras: CartExtra[] = [];
    ids.forEach(id => {
      const topping = this.toppings.find(t => t.id === id);
      if (topping) extras.push({ id: topping.id, name: topping.name, price: topping.price });
    });
    return extras;
  }
}
