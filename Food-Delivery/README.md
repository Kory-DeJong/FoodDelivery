# FeastFinder - Food Delivery Application

## Overview
FeastFinder is a comprehensive food delivery application that allows users to browse restaurants, order food, track delivery status, and apply discounts. The application is built using Java for the backend and HTML/CSS/JavaScript for the frontend, implementing various design patterns to ensure flexibility, maintainability, and scalability.

## Design Patterns Implemented

### Creational Patterns
1. **Factory Method Pattern**
   - Implementation: `DishFactory`, `PizzaDishFactory`, `BurgerDishFactory`, `SushiDishFactory`
   - Purpose: Creates different types of dishes without exposing the creation logic to the client
   - Requirement addressed: F2, F4 (Different dish types)

2. **Singleton Pattern**
   - Implementation: `AppConfig`
   - Purpose: Ensures only one instance of application configuration exists
   - Requirement addressed: NF2 (System configuration)

### Structural Patterns
1. **Decorator Pattern**
   - Implementation: `DishDecorator`, `ExtraCheeseDecorator`, `ExtraSauceDecorator`
   - Purpose: Dynamically adds additional features to dishes (toppings)
   - Requirement addressed: F5 (Adding toppings to dishes)

### Behavioral Patterns
1. **Observer Pattern**
   - Implementation: `OrderObservable`, `OrderObserver`, `EmailNotificationObserver`, `SMSNotificationObserver`
   - Purpose: Notifies users about order status changes
   - Requirement addressed: F7 (Order status notifications)

2. **Strategy Pattern**
   - Implementation: 
     - `PaymentStrategy`, `CreditCardPaymentStrategy`, `PayPalPaymentStrategy`, `CashOnDeliveryPaymentStrategy`
     - `DiscountStrategy`, `PercentageDiscountStrategy`, `FlatDiscountStrategy`, `NoDiscountStrategy`
   - Purpose: Defines a family of algorithms for payment methods and discount calculations
   - Requirements addressed: F6 (Multiple payment methods), F8 (Discount strategies)

## Functional Requirements Implementation

1. **F1: Browse Restaurants**
   - Users can view a list of restaurants on the main page
   - Implementation: `RestaurantService`, frontend restaurant display

2. **F2: Multiple Dishes per Restaurant**
   - Each restaurant offers various dishes through the menu system
   - Implementation: Restaurant-to-Dish relationship in the data model

3. **F3: Order Dishes**
   - Users can add dishes to cart and place orders
   - Implementation: `OrderService`, frontend cart functionality

4. **F4: Different Dish Types**
   - System supports various dish types (Veg, Non-Veg, Vegan, etc.)
   - Implementation: `Dish.DishType` enum, dish type display in UI

5. **F5: Add Toppings**
   - Users can add extra toppings to dishes
   - Implementation: Decorator pattern with `ExtraCheeseDecorator`, `ExtraSauceDecorator`

6. **F6: Multiple Payment Methods**
   - Support for Credit Card, PayPal, and Cash on Delivery
   - Implementation: Strategy pattern with various payment strategies

7. **F7: Order Status Notifications**
   - Users receive notifications when order status changes
   - Implementation: Observer pattern with notification observers

8. **F8: Discount Strategies**
   - Support for different discount types (Percentage, Flat, None)
   - Implementation: Strategy pattern with discount strategies

## Non-Functional Requirements Implementation

1. **NF1: Command-Line Interface**
   - Initial implementation includes CLI through `FeastFinderCLI`
   - Web interface also provided for enhanced user experience

2. **NF2: System Configuration**
   - Single instance of application configuration using Singleton pattern
   - Implementation: `AppConfig` class

3. **NF3: Maintenance and Expandability**
   - Design patterns ensure loose coupling and high cohesion
   - Clear separation of concerns between components
   - Modular architecture allows for easy extension

## Team Collaboration
- Version Control: Git was used for version control
- Task Distribution: Team members were assigned specific components based on expertise
- Communication: Regular meetings and collaboration tools were used to coordinate efforts

## Setup and Installation
1. Clone the repository
2. Backend (H2 default)
   - Build: `cd Food-Delivery/backend && mvn clean package`
   - Run: `java -jar target/feastfinder-backend-1.0.0.jar`
   - API base: `http://localhost:8080/api`
   - CLI (NF1): enable with `--cli.enabled=true` to run interactive CLI alongside server
   - Tests: `mvn test` (unit + integration tests for controllers and patterns)
3. Backend (PostgreSQL + Flyway, dev profile)
   - Start DB: `cd Food-Delivery && docker compose up -d db`
   - Run backend with profile: `cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev`
   - Flyway runs `V1__init.sql` automatically; JPA `ddl-auto=validate` enforces schema
   - JDBC: `jdbc:postgresql://localhost:5432/feastfinder`, user/pass: `feast/feast`
4. Frontend (Angular)
   - `cd Food-Delivery/feastfinder-frontend && npm install && npm start`
   - Open `http://localhost:4200` (proxy to backend enabled)
5. Optionally, use the static HTML demo under `Food-Delivery/frontend/` for reference

## Seeded Demo Account
- Username: `demo`
- Email: `demo@demo.com`
- Password: `Passw0rd!`

## Future Enhancements
- User authentication and profiles
- Restaurant ratings and reviews
- Delivery tracking with maps integration
- Mobile application development

## Notes on Requirements Compliance
- F1–F5 implemented via controllers/services and domain model.
- F6–F8 implemented via Strategy/Observer patterns and REST endpoints.
- NF1 CLI available via `FeastFinderCLI` (toggle with `cli.enabled`).
- NF2 Singleton `AppConfig` holds global configuration.
- NF3 Clean layering and design patterns ensure maintainability.

## Authentication (JWT)
- Endpoints
  - `POST /api/auth/register`: { username, email, password } → { token, user }
  - `POST /api/auth/login`: { usernameOrEmail, password } → { token, user }
  - `GET /api/auth/me`: current user (requires `Authorization: Bearer <token>`)
- Frontend
  - Login/Signup pages under `/login`, `/register`
  - Auth interceptor attaches bearer token; checkout is guarded
