import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Restaurant, RestaurantService, Dish, ToppingOption } from '../services/restaurant.service';
import { Order, OrderService } from '../services/order.service';
import { AdminService, DiscountCode, AdminOverview } from '../services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="main admin-grid">
      <div class="stats-row" *ngIf="overview">
        <div class="stat-card">
          <span class="value">{{ overview!.restaurants }}</span>
          <span>Restaurants</span>
        </div>
        <div class="stat-card">
          <span class="value">{{ overview!.dishes }}</span>
          <span>Dishes</span>
        </div>
        <div class="stat-card">
          <span class="value">{{ overview!.orders }}</span>
          <span>Orders</span>
        </div>
        <div class="stat-card">
          <span class="value">{{ overview!.users }}</span>
          <span>Users</span>
        </div>
        <div class="stat-card">
          <span class="value">{{ overview!.activeDiscounts }}</span>
          <span>Active Discounts</span>
        </div>
      </div>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title><mat-icon>store</mat-icon> Manage Restaurants</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form class="form" (ngSubmit)="createRestaurant()" #rForm="ngForm">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput name="name" [(ngModel)]="newRestaurant.name" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Cuisine</mat-label>
              <input matInput name="cuisine" [(ngModel)]="newRestaurant.cuisineType" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="wide">
              <mat-label>Description</mat-label>
              <textarea matInput rows="2" name="description" [(ngModel)]="newRestaurant.description"></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="rForm.invalid">Add Restaurant</button>
          </form>

          <mat-divider></mat-divider>

          <div class="list">
            <div class="list-header">
              <strong>{{ restaurants.length }}</strong> restaurants
            </div>
            <div *ngFor="let restaurant of restaurants" class="list-row">
              <div>
                <div class="title">{{ restaurant.name }}</div>
                <div class="muted">{{ restaurant.cuisineType }}</div>
              </div>
              <button mat-stroked-button color="warn" (click)="removeRestaurant(restaurant.id)">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title><mat-icon>restaurant_menu</mat-icon> Add Menu Item</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form class="form" (ngSubmit)="addDish()" #dForm="ngForm">
            <mat-form-field appearance="outline" class="wide">
              <mat-label>Restaurant</mat-label>
              <mat-select name="restaurant" [(ngModel)]="newDish.restaurantId" required>
                <mat-option *ngFor="let r of restaurants" [value]="r.id">{{ r.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Dish name</mat-label>
              <input matInput name="dishName" [(ngModel)]="newDish.name" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select name="type" [(ngModel)]="newDish.type" required>
                <mat-option *ngFor="let type of dishTypes" [value]="type">{{ type }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Price</mat-label>
              <input matInput type="number" step="0.01" name="price" [(ngModel)]="newDish.price" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="wide">
              <mat-label>Description</mat-label>
              <textarea matInput rows="2" name="dishDescription" [(ngModel)]="newDish.description"></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="dForm.invalid">Add Dish</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title><mat-icon>local_offer</mat-icon> Discount Codes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form class="form" (ngSubmit)="createDiscountCode()" #discForm="ngForm">
            <mat-form-field appearance="outline">
              <mat-label>Code</mat-label>
              <input matInput name="code" [(ngModel)]="discountForm.code" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select name="type" [(ngModel)]="discountForm.type" required>
                <mat-option value="PERCENT">Percentage</mat-option>
                <mat-option value="FLAT">Flat</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Value</mat-label>
              <input matInput type="number" min="0" step="0.5" name="value" [(ngModel)]="discountForm.value" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select name="active" [(ngModel)]="discountForm.active" required>
                <mat-option [value]="true">Active</mat-option>
                <mat-option [value]="false">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="discForm.invalid">Create Code</button>
          </form>

          <mat-divider></mat-divider>

          <div class="list">
            <div class="list-row" *ngFor="let code of discountCodes">
              <div>
                <div class="title">{{ code.code }}</div>
                <div class="muted">{{ code.type }} • {{ code.value }}</div>
              </div>
              <button mat-stroked-button color="primary" (click)="toggleDiscount(code)">
                <mat-icon>{{ code.active ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                {{ code.active ? 'Disable' : 'Activate' }}
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="panel">
        <mat-card-header>
          <mat-card-title><mat-icon>tapas</mat-icon> Toppings Library</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="wide">
            <mat-label>Select restaurant</mat-label>
            <mat-select [(ngModel)]="selectedRestaurantForToppings" name="toppingRestaurant" (selectionChange)="loadToppings()">
              <mat-option *ngFor="let r of restaurants" [value]="r.id">{{ r.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <div *ngIf="selectedRestaurantForToppings" class="toppings">
            <div class="chips">
              <mat-chip-set>
                <mat-chip *ngFor="let topping of restaurantToppings" (removed)="removeTopping(topping)">
                  {{ topping.name }} ({{ topping.price | currency:'USD':'symbol':'1.2-2' }})
                  <button mat-icon-button matChipRemove type="button" *ngIf="topping.removable">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              </mat-chip-set>
            </div>

            <form class="form" (ngSubmit)="addToppingOption()" #tForm="ngForm">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput name="toppingName" [(ngModel)]="newTopping.name" required>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Price</mat-label>
                <input matInput type="number" step="0.1" name="toppingPrice" [(ngModel)]="newTopping.price" required>
              </mat-form-field>
              <mat-form-field appearance="outline" class="wide">
                <mat-label>Description</mat-label>
                <textarea matInput rows="2" name="toppingDesc" [(ngModel)]="newTopping.description"></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline" class="wide">
                <mat-label>Allowed dish types</mat-label>
                <mat-select name="toppingTypes" multiple [(ngModel)]="newTopping.compatibleTypes">
                  <mat-option *ngFor="let type of dishTypes" [value]="type">{{ type }}</mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="tForm.invalid">Add Topping</button>
            </form>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="panel full">
        <mat-card-header>
          <mat-card-title><mat-icon>receipt_long</mat-icon> Orders</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="orders">
            <div class="orders-row head">
              <span>ID</span>
              <span>Restaurant</span>
              <span>Delivery</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            <div class="orders-row" *ngFor="let order of orders">
              <span>{{ order.id }}</span>
              <span>{{ order.restaurantName }}</span>
              <span>{{ order.deliveryAddress }}</span>
              <span>$ {{ order.totalAmount | number:'1.2-2' }}</span>
              <span>
                <mat-select [(ngModel)]="order.status" [ngModelOptions]="{ standalone: true }" (selectionChange)="changeStatus(order)" disableOptionCentering>
                  <mat-option *ngFor="let status of statusOptions" [value]="status">{{ status }}</mat-option>
                </mat-select>
              </span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .panel mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .form .wide {
      grid-column: 1 / -1;
    }
    .list {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .list-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 12px;
      background: #f8f9fa;
    }
    .title {
      font-weight: 600;
    }
    .muted {
      font-size: 0.85rem;
      color: var(--text-light);
    }
    .orders {
      width: 100%;
      overflow-x: auto;
    }
    .orders-row {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1.2fr 0.6fr 0.8fr;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .orders-row.head {
      font-weight: 600;
    }
    .orders-row mat-select {
      width: 160px;
    }
    .full {
      width: 100%;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
    }
    .stat-card {
      background: #fff5f0;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border: 1px solid rgba(0,0,0,0.05);
    }
    .stat-card .value {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .toppings {
      margin-top: 12px;
    }
    .chips {
      margin-bottom: 12px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  restaurants: Restaurant[] = [];
  orders: Order[] = [];
  statusOptions: Order['status'][] = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
  overview: AdminOverview | null = null;
  discountCodes: DiscountCode[] = [];
  restaurantToppings: ToppingOption[] = [];
  selectedRestaurantForToppings = '';

  newRestaurant: Partial<Restaurant> = { name: '', cuisineType: '', description: '' };
  newDish: Partial<Dish> & { restaurantId?: string } = { type: 'VEGETARIAN', price: 10 };
  newTopping: Partial<ToppingOption> & { compatibleTypes: Dish['type'][] } = { compatibleTypes: [], price: 1 };
  discountForm: { code: string; type: 'PERCENT' | 'FLAT'; value: number; active: boolean } = { code: '', type: 'PERCENT', value: 10, active: true };
  dishTypes: Dish['type'][] = ['VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'];

  constructor(
    private restaurantsApi: RestaurantService,
    private ordersApi: OrderService,
    private admin: AdminService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.refreshRestaurants();
    this.refreshOrders();
    this.refreshDiscounts();
    this.refreshOverview();
  }

  refreshOverview() {
    this.admin.overview().subscribe({ next: data => this.overview = data });
  }

  refreshRestaurants() {
    this.restaurantsApi.list().subscribe({ next: data => this.restaurants = data });
  }

  refreshOrders() {
    this.ordersApi.list().subscribe({ next: data => this.orders = data });
  }

  refreshDiscounts() {
    this.admin.listDiscounts().subscribe({ next: data => this.discountCodes = data });
  }

  createRestaurant() {
    if (!this.newRestaurant.name || !this.newRestaurant.cuisineType) return;
    this.restaurantsApi.create(this.newRestaurant).subscribe({
      next: () => {
        this.snack.open('Restaurant created', 'Close', { duration: 2000 });
        this.newRestaurant = { name: '', cuisineType: '', description: '' };
        this.refreshRestaurants();
      },
      error: () => this.snack.open('Failed to create restaurant', 'Close', { duration: 2500 })
    });
  }

  addDish() {
    if (!this.newDish.restaurantId || !this.newDish.name || !this.newDish.type) return;
    this.restaurantsApi.addDish(this.newDish.restaurantId, {
      name: this.newDish.name,
      description: this.newDish.description,
      type: this.newDish.type,
      price: this.newDish.price
    } as Partial<Dish>).subscribe({
      next: () => {
        this.snack.open('Dish added', 'Close', { duration: 2000 });
        this.newDish = { restaurantId: this.newDish.restaurantId, type: 'VEGETARIAN', price: 10 };
      },
      error: () => this.snack.open('Failed to add dish', 'Close', { duration: 2500 })
    });
  }

  removeRestaurant(id: string) {
    if (!confirm('Delete this restaurant?')) return;
    this.restaurantsApi.remove(id).subscribe({
      next: () => {
        this.snack.open('Restaurant removed', 'Close', { duration: 2000 });
        if (this.selectedRestaurantForToppings === id) {
          this.selectedRestaurantForToppings = '';
          this.restaurantToppings = [];
        }
        this.refreshRestaurants();
      },
      error: () => this.snack.open('Failed to delete', 'Close', { duration: 2500 })
    });
  }

  createDiscountCode() {
    if (!this.discountForm.code) return;
    this.admin.createDiscount(this.discountForm).subscribe({
      next: () => {
        this.snack.open('Discount created', 'Close', { duration: 2000 });
        this.discountForm = { code: '', type: 'PERCENT', value: 10, active: true };
        this.refreshDiscounts();
        this.refreshOverview();
      },
      error: () => this.snack.open('Failed to create discount', 'Close', { duration: 2500 })
    });
  }

  toggleDiscount(code: DiscountCode) {
    this.admin.updateDiscount(code.code, { active: !code.active }).subscribe({
      next: () => {
        this.snack.open('Discount updated', 'Close', { duration: 2000 });
        this.refreshDiscounts();
        this.refreshOverview();
      },
      error: () => this.snack.open('Failed to update discount', 'Close', { duration: 2500 })
    });
  }

  loadToppings() {
    if (!this.selectedRestaurantForToppings) {
      this.restaurantToppings = [];
      return;
    }
    this.admin.listToppings(this.selectedRestaurantForToppings).subscribe({
      next: data => this.restaurantToppings = data
    });
  }

  addToppingOption() {
    if (!this.selectedRestaurantForToppings || !this.newTopping.name) return;
    this.admin.addTopping(this.selectedRestaurantForToppings, {
      name: this.newTopping.name,
      price: this.newTopping.price,
      description: this.newTopping.description,
      compatibleTypes: this.newTopping.compatibleTypes?.length ? this.newTopping.compatibleTypes : undefined
    }).subscribe({
      next: list => {
        this.restaurantToppings = list;
        this.newTopping = { compatibleTypes: [], price: 1 };
        this.snack.open('Topping added', 'Close', { duration: 2000 });
      },
      error: () => this.snack.open('Failed to add topping', 'Close', { duration: 2500 })
    });
  }

  removeTopping(topping: ToppingOption) {
    if (!this.selectedRestaurantForToppings || !topping.removable) return;
    this.admin.removeTopping(this.selectedRestaurantForToppings, topping.id).subscribe({
      next: () => {
        this.snack.open('Topping removed', 'Close', { duration: 2000 });
        this.loadToppings();
      },
      error: () => this.snack.open('Failed to remove topping', 'Close', { duration: 2500 })
    });
  }

  changeStatus(order: Order) {
    this.ordersApi.updateStatus(order.id, order.status).subscribe({
      next: () => this.snack.open('Status updated', 'Close', { duration: 2000 }),
      error: () => this.snack.open('Failed to update status', 'Close', { duration: 2500 })
    });
  }
}
