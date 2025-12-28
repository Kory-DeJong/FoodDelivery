import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FavoriteService } from '../services/favorite.service';
import { RouterModule } from '@angular/router';
import { Restaurant, RestaurantService } from '../services/restaurant.service';
import { MockDataService } from '../services/mock-data.service';

@Component({
  standalone: true,
  selector: 'app-restaurant-list',
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
  <section class="hero">
    <div class="hero-inner">
      <h1>🍕 Delicious food, delivered fast</h1>
      <p>Order from your favorite restaurants and get it delivered to your door</p>
      <div class="search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search restaurants, cuisines, or dishes</mat-label>
          <input matInput [(ngModel)]="query" (ngModelChange)="onSearchChange()" placeholder="Pizza, Sushi, Burgers...">
          <mat-icon matPrefix>search</mat-icon>
          <button mat-icon-button matSuffix *ngIf="query" (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
        <button mat-raised-button color="accent" class="search-btn">
          <mat-icon>search</mat-icon>
          {{ filtered.length }} Results
        </button>
      </div>
    </div>
  </section>

  <div class="main">
    <!-- Quick Categories -->
    <div class="categories">
      <h2 class="section-title">Browse by Category</h2>
      <div class="category-grid">
        <div class="category-card" *ngFor="let cat of categories"
             (click)="filterByCategory(cat.name)"
             [class.active]="selectedCategory === cat.name"
             style="cursor: pointer;">
          <mat-icon>{{ cat.icon }}</mat-icon>
          <span>{{ cat.name }}</span>
        </div>
      </div>
    </div>

    <!-- Active Filters -->
    <div class="active-filters" *ngIf="hasActiveFilters()">
      <span class="filter-label">Active filters:</span>
      <mat-chip *ngIf="query" (removed)="clearSearch()">
        Search: "{{ query }}"
        <button matChipRemove><mat-icon>cancel</mat-icon></button>
      </mat-chip>
      <mat-chip *ngIf="selectedCategory" (removed)="clearCategory()">
        Category: {{ selectedCategory }}
        <button matChipRemove><mat-icon>cancel</mat-icon></button>
      </mat-chip>
      <button mat-button color="warn" (click)="clearAllFilters()" *ngIf="hasActiveFilters()">
        <mat-icon>clear_all</mat-icon>
        Clear All
      </button>
    </div>

    <!-- Restaurants -->
    <h2 class="section-title">Popular Restaurants Near You</h2>
    <div *ngIf="loading" class="loading-state">
      <mat-icon>restaurant</mat-icon>
      <p>Finding the best restaurants for you...</p>
    </div>
    <div *ngIf="error" class="error">
      <mat-icon>error_outline</mat-icon>
      {{ error }}
    </div>
    <div class="grid" *ngIf="!loading">
      <a *ngFor="let r of filtered" [routerLink]="['/restaurant', r.id]" class="restaurant-card">
        <div class="image" [style.backgroundImage]="'url(' + (r.image || placeholder) + ')'">
          <div class="badge" *ngIf="r.rating && r.rating >= 4.5">
            <mat-icon>star</mat-icon>
            Top Rated
          </div>
          <button mat-icon-button class="fav-btn" (click)="toggleFavorite($event, r.id)" [class.active]="isFav(r.id)">
            <mat-icon>{{ isFav(r.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
          </button>
        </div>
        <div class="info">
          <h3>{{ r.name }}</h3>
          <p>{{ r.description }}</p>
          <div class="row small">
            <span class="tag primary">{{ r.cuisineType }}</span>
            <span class="rating">
              <mat-icon>star</mat-icon>
              {{ r.rating || 'New' }}
            </span>
          </div>
          <div class="row small meta-row">
            <span><mat-icon>schedule</mat-icon> 25-35 min</span>
            <span><mat-icon>delivery_dining</mat-icon> Free delivery</span>
          </div>
        </div>
      </a>
    </div>
  </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%);
      position: relative;
    }

    .search {
      display: flex;
      gap: var(--spacing-md);
      max-width: 700px;
      align-items: stretch;
    }

    @media (max-width: 640px) {
      .search {
        flex-direction: column;
      }
    }

    .search-field {
      flex: 1;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      background: white !important;
      border-radius: var(--radius-lg) !important;
    }

    .search-field ::ng-deep .mat-mdc-form-field-icon-prefix {
      padding-left: var(--spacing-md);
    }

    .search-btn {
      height: 56px !important;
      padding: 0 var(--spacing-xl) !important;
      font-size: 1rem !important;
      font-weight: 700 !important;
      white-space: nowrap;
    }

    .search-btn mat-icon {
      margin-right: var(--spacing-sm);
    }

    .categories {
      margin: var(--spacing-2xl) 0;
    }

    .section-title {
      margin-bottom: var(--spacing-lg);
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }

    @media (max-width: 640px) {
      .category-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: var(--spacing-md);
      }
    }

    .category-card {
      background: var(--bg-white);
      padding: var(--spacing-xl) var(--spacing-lg);
      border-radius: var(--radius-lg);
      transition: var(--transition);
      text-align: center;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      border: 2px solid var(--border-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .category-card.active {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(232, 90, 42, 0.1) 100%);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .category-card mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--primary-color);
      display: block;
    }

    .category-card span {
      display: block;
      font-weight: 600;
      color: var(--text-dark);
      font-size: 0.95rem;
    }

    .active-filters {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex-wrap: wrap;
      margin: var(--spacing-xl) 0;
      padding: var(--spacing-lg);
      background: var(--bg-light);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }

    .filter-label {
      font-weight: 700;
      color: var(--text-dark);
      font-size: 0.95rem;
    }

    .active-filters mat-chip {
      background: var(--bg-white) !important;
      border: 1px solid var(--border-color) !important;
      font-weight: 500 !important;
    }

    .active-filters button[mat-button] {
      margin-left: auto;
    }

    .loading-state {
      text-align: center;
      padding: var(--spacing-2xl) var(--spacing-lg);
      color: var(--text-light);
    }

    .loading-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-color);
      margin-bottom: 16px;
    }

    .badge {
      position: absolute;
      top: var(--spacing-md);
      left: var(--spacing-md);
      background: var(--primary-color);
      color: white;
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      box-shadow: var(--shadow-md);
    }

    .badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .fav-btn {
      position: absolute !important;
      top: var(--spacing-sm) !important;
      right: var(--spacing-sm) !important;
      background: rgba(255,255,255,0.95) !important;
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-sm) !important;
      transition: var(--transition) !important;
    }

    .fav-btn:hover {
      transform: scale(1.1);
      box-shadow: var(--shadow-md) !important;
    }

    .fav-btn.active {
      color: var(--danger) !important;
      background: rgba(231, 76, 60, 0.1) !important;
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-weight: 700;
      color: var(--warning);
      font-size: 0.9rem;
    }

    .rating mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--warning);
    }

    .row.small {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    .meta-row {
      margin-top: var(--spacing-md);
      font-size: 0.85rem;
      color: var(--text-light);
      display: flex;
      gap: var(--spacing-lg);
    }

    .meta-row span {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      white-space: nowrap;
    }

    .meta-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = false;
  error: string | null = null;
  query = '';
  selectedCategory = '';
  placeholder = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60';
  favorites = new Set<string>();

  categories = [
    { name: 'All', icon: 'restaurant' },
    { name: 'Pizza', icon: 'local_pizza' },
    { name: 'Burgers', icon: 'lunch_dining' },
    { name: 'Sushi', icon: 'set_meal' },
    { name: 'Desserts', icon: 'cake' },
    { name: 'Healthy', icon: 'eco' },
    { name: 'Fast Food', icon: 'fastfood' }
  ];

  constructor(
    private api: RestaurantService,
    private fav: FavoriteService,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.list().subscribe({
      next: d => { this.restaurants = d; this.loading = false; },
      error: () => {
        this.error = 'Backend not reachable, showing sample data';
        this.restaurants = this.mockData.getRestaurants();
        this.loading = false;
      }
    });
    this.refreshFavs();
  }

  get filtered(): Restaurant[] {
    let result = [...this.restaurants];

    // Apply search filter
    const q = this.query.trim().toLowerCase();
    if (q) {
      result = result.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.cuisineType || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      );
    }

    // Apply category filter
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      result = result.filter(r =>
        (r.cuisineType || '').toLowerCase().includes(this.selectedCategory.toLowerCase()) ||
        (r.name || '').toLowerCase().includes(this.selectedCategory.toLowerCase())
      );
    }

    return result;
  }

  onSearchChange() {
    // Trigger filtering by accessing the filtered getter
  }

  clearSearch() {
    this.query = '';
  }

  filterByCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = '';
    } else {
      this.selectedCategory = category === 'All' ? '' : category;
    }
  }

  clearCategory() {
    this.selectedCategory = '';
  }

  clearAllFilters() {
    this.query = '';
    this.selectedCategory = '';
  }

  hasActiveFilters(): boolean {
    return !!this.query || !!this.selectedCategory;
  }

  refreshFavs() { this.fav.list().subscribe(set => this.favorites = set); }
  isFav(id: string) { return this.favorites.has(id); }
  toggleFavorite(ev: Event, id: string) {
    ev.preventDefault(); ev.stopPropagation();
    if (this.isFav(id)) {
      this.fav.remove(id).subscribe(() => this.favorites.delete(id));
    } else {
      this.fav.add(id).subscribe(() => this.favorites.add(id));
    }
  }
}
