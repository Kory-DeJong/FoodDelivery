import { Injectable } from '@angular/core';
import { Restaurant, Dish, ToppingOption } from './restaurant.service';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  
  getRestaurants(): Restaurant[] {
    return [
      {
        id: 'rest1',
        name: 'Pizza Paradise',
        description: 'Authentic Italian pizza made with love and fresh ingredients',
        cuisineType: 'Italian',
        rating: 4.8,
        address: '123 Main St, Downtown',
        phoneNumber: '+1 (555) 123-4567',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'
      },
      {
        id: 'rest2',
        name: 'Burger Bliss',
        description: 'Juicy gourmet burgers and crispy fries',
        cuisineType: 'American',
        rating: 4.6,
        address: '456 Oak Ave, Midtown',
        phoneNumber: '+1 (555) 234-5678',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
      },
      {
        id: 'rest3',
        name: 'Sushi Supreme',
        description: 'Fresh sushi and sashimi daily from the finest fish markets',
        cuisineType: 'Japanese',
        rating: 4.9,
        address: '789 Pine Rd, Uptown',
        phoneNumber: '+1 (555) 345-6789',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'
      },
      {
        id: 'rest4',
        name: 'Taco Fiesta',
        description: 'Authentic Mexican street food and tacos',
        cuisineType: 'Mexican',
        rating: 4.7,
        address: '321 Elm St, Westside',
        phoneNumber: '+1 (555) 456-7890',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800'
      },
      {
        id: 'rest5',
        name: 'Green Bowl',
        description: 'Healthy bowls, smoothies, and organic salads',
        cuisineType: 'Healthy',
        rating: 4.5,
        address: '654 Maple Dr, Eastside',
        phoneNumber: '+1 (555) 567-8901',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
      },
      {
        id: 'rest6',
        name: 'Dragon Wok',
        description: 'Traditional Chinese cuisine with modern twists',
        cuisineType: 'Chinese',
        rating: 4.4,
        address: '987 Cedar Ln, Chinatown',
        phoneNumber: '+1 (555) 678-9012',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800'
      },
      {
        id: 'rest7',
        name: 'Curry House',
        description: 'Aromatic Indian curries and tandoori specialties',
        cuisineType: 'Indian',
        rating: 4.7,
        address: '147 Spice St, Little India',
        phoneNumber: '+1 (555) 789-0123',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'
      },
      {
        id: 'rest8',
        name: 'Pasta Perfetto',
        description: 'Handmade pasta and classic Italian dishes',
        cuisineType: 'Italian',
        rating: 4.6,
        address: '258 Roma Ave, Little Italy',
        phoneNumber: '+1 (555) 890-1234',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800'
      },
      {
        id: 'rest9',
        name: 'BBQ Pit Stop',
        description: 'Slow-smoked meats and southern comfort food',
        cuisineType: 'American',
        rating: 4.8,
        address: '369 Smoke Rd, South End',
        phoneNumber: '+1 (555) 901-2345',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
      },
      {
        id: 'rest10',
        name: 'Ramen House',
        description: 'Authentic Japanese ramen and noodle bowls',
        cuisineType: 'Japanese',
        rating: 4.7,
        address: '741 Noodle St, Downtown',
        phoneNumber: '+1 (555) 012-3456',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'
      },
      {
        id: 'rest11',
        name: 'Mediterranean Grill',
        description: 'Fresh Mediterranean cuisine with authentic flavors',
        cuisineType: 'Mediterranean',
        rating: 4.6,
        address: '852 Olive Ave, Midtown',
        phoneNumber: '+1 (555) 123-4567',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'
      },
      {
        id: 'rest12',
        name: 'Thai Spice',
        description: 'Authentic Thai dishes with bold flavors',
        cuisineType: 'Thai',
        rating: 4.8,
        address: '963 Spice Rd, Eastside',
        phoneNumber: '+1 (555) 234-5678',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800'
      },
      {
        id: 'rest13',
        name: 'French Bistro',
        description: 'Classic French cuisine in an elegant setting',
        cuisineType: 'French',
        rating: 4.9,
        address: '159 Paris Lane, Uptown',
        phoneNumber: '+1 (555) 345-6789',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
      },
      {
        id: 'rest14',
        name: 'Korean BBQ Palace',
        description: 'All-you-can-eat Korean BBQ and traditional dishes',
        cuisineType: 'Korean',
        rating: 4.7,
        address: '357 Seoul St, Koreatown',
        phoneNumber: '+1 (555) 456-7890',
        image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800'
      },
      {
        id: 'rest15',
        name: 'Vegan Delight',
        description: 'Plant-based cuisine that everyone will love',
        cuisineType: 'Vegan',
        rating: 4.5,
        address: '468 Green Way, Westside',
        phoneNumber: '+1 (555) 567-8901',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'
      },
      {
        id: 'rest16',
        name: 'Seafood Shack',
        description: 'Fresh catch of the day and coastal favorites',
        cuisineType: 'Seafood',
        rating: 4.8,
        address: '579 Harbor Dr, Waterfront',
        phoneNumber: '+1 (555) 678-9012',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
      },
      {
        id: 'rest17',
        name: 'Steakhouse Prime',
        description: 'Premium cuts and fine dining experience',
        cuisineType: 'Steakhouse',
        rating: 4.9,
        address: '680 Prime Ave, Financial District',
        phoneNumber: '+1 (555) 789-0123',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800'
      },
      {
        id: 'rest18',
        name: 'Breakfast Club',
        description: 'All-day breakfast and brunch favorites',
        cuisineType: 'Breakfast',
        rating: 4.6,
        address: '791 Morning St, Suburbs',
        phoneNumber: '+1 (555) 890-1234',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800'
      },
      {
        id: 'rest19',
        name: 'Poke Bowl Paradise',
        description: 'Fresh Hawaiian poke bowls and island flavors',
        cuisineType: 'Hawaiian',
        rating: 4.7,
        address: '802 Aloha Blvd, Beach Area',
        phoneNumber: '+1 (555) 901-2345',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
      },
      {
        id: 'rest20',
        name: 'Dessert Heaven',
        description: 'Artisan desserts, cakes, and sweet treats',
        cuisineType: 'Desserts',
        rating: 4.9,
        address: '913 Sweet St, Downtown',
        phoneNumber: '+1 (555) 012-3456',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'
      },
      {
        id: 'rest17',
        name: 'Korean BBQ House',
        description: 'Interactive grilling and authentic Korean flavors',
        cuisineType: 'Korean',
        rating: 4.6,
        address: '246 Seoul St, Koreatown',
        phoneNumber: '+1 (555) 789-0124',
        image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800'
      },
      {
        id: 'rest18',
        name: 'Breakfast Club',
        description: 'All-day breakfast and brunch favorites',
        cuisineType: 'Breakfast',
        rating: 4.5,
        address: '135 Morning Ave, Suburb',
        phoneNumber: '+1 (555) 890-1235',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800'
      },
      {
        id: 'rest19',
        name: 'Dessert Dreams',
        description: 'Decadent desserts, cakes, and pastries',
        cuisineType: 'Desserts',
        rating: 4.9,
        address: '468 Sweet St, Sugar District',
        phoneNumber: '+1 (555) 901-2346',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'
      },
      {
        id: 'rest20',
        name: 'Pho Palace',
        description: 'Traditional Vietnamese pho and banh mi',
        cuisineType: 'Vietnamese',
        rating: 4.7,
        address: '579 Saigon Rd, Little Vietnam',
        phoneNumber: '+1 (555) 012-3457',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800'
      }
    ];
  }

  getDishesForRestaurant(restaurantId: string): Dish[] {
    const dishes: { [key: string]: Dish[] } = {
      'rest1': [
        { id: 'd1', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', type: 'VEGETARIAN', price: 12.99 },
        { id: 'd2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese', type: 'NON_VEGETARIAN', price: 14.99 },
        { id: 'd3', name: 'BBQ Chicken Pizza', description: 'BBQ sauce, chicken, red onions', type: 'NON_VEGETARIAN', price: 15.99 },
        { id: 'd4', name: 'Veggie Supreme', description: 'Bell peppers, mushrooms, olives, onions', type: 'VEGETARIAN', price: 13.99 },
        { id: 'd5', name: 'Meat Lovers', description: 'Pepperoni, sausage, bacon, ham', type: 'NON_VEGETARIAN', price: 16.99 },
        { id: 'd6', name: 'Hawaiian Pizza', description: 'Ham and pineapple', type: 'NON_VEGETARIAN', price: 14.49 },
        { id: 'd7', name: 'Four Cheese', description: 'Mozzarella, parmesan, gorgonzola, ricotta', type: 'VEGETARIAN', price: 15.49 },
        { id: 'd8', name: 'Garlic Bread', description: 'Toasted bread with garlic butter', type: 'VEGETARIAN', price: 5.99 },
        { id: 'd9', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, caesar dressing', type: 'VEGETARIAN', price: 7.99 },
        { id: 'd10', name: 'Tiramisu', description: 'Classic Italian dessert', type: 'VEGETARIAN', price: 6.99 }
      ],
      'rest2': [
        { id: 'd11', name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato', type: 'NON_VEGETARIAN', price: 10.99 },
        { id: 'd12', name: 'Bacon Burger', description: 'Double beef, bacon, cheese', type: 'NON_VEGETARIAN', price: 13.99 },
        { id: 'd13', name: 'Veggie Burger', description: 'Plant-based patty, avocado, sprouts', type: 'VEGETARIAN', price: 11.99 },
        { id: 'd14', name: 'Chicken Burger', description: 'Crispy chicken, mayo, pickles', type: 'NON_VEGETARIAN', price: 11.49 },
        { id: 'd15', name: 'Mushroom Swiss Burger', description: 'Beef, sautéed mushrooms, swiss cheese', type: 'NON_VEGETARIAN', price: 12.99 },
        { id: 'd16', name: 'French Fries', description: 'Crispy golden fries', type: 'VEGETARIAN', price: 4.99 },
        { id: 'd17', name: 'Onion Rings', description: 'Beer-battered onion rings', type: 'VEGETARIAN', price: 5.99 },
        { id: 'd18', name: 'Milkshake', description: 'Vanilla, chocolate, or strawberry', type: 'VEGETARIAN', price: 5.49 },
        { id: 'd19', name: 'Chicken Tenders', description: 'Crispy chicken strips with sauce', type: 'NON_VEGETARIAN', price: 8.99 },
        { id: 'd20', name: 'Loaded Fries', description: 'Fries with cheese, bacon, sour cream', type: 'NON_VEGETARIAN', price: 7.99 }
      ],
      'rest3': [
        { id: 'd21', name: 'California Roll', description: 'Crab, avocado, cucumber', type: 'NON_VEGETARIAN', price: 8.99 },
        { id: 'd22', name: 'Spicy Tuna Roll', description: 'Tuna, spicy mayo, cucumber', type: 'NON_VEGETARIAN', price: 10.99 },
        { id: 'd23', name: 'Salmon Nigiri', description: 'Fresh salmon over rice (2 pieces)', type: 'NON_VEGETARIAN', price: 6.99 },
        { id: 'd24', name: 'Vegetable Roll', description: 'Cucumber, avocado, carrot', type: 'VEGETARIAN', price: 7.99 },
        { id: 'd25', name: 'Dragon Roll', description: 'Eel, cucumber, avocado on top', type: 'NON_VEGETARIAN', price: 14.99 },
        { id: 'd26', name: 'Rainbow Roll', description: 'California roll topped with assorted fish', type: 'NON_VEGETARIAN', price: 15.99 },
        { id: 'd27', name: 'Edamame', description: 'Steamed soybeans with sea salt', type: 'VEGAN', price: 4.99 },
        { id: 'd28', name: 'Miso Soup', description: 'Traditional Japanese soup', type: 'VEGETARIAN', price: 3.99 },
        { id: 'd29', name: 'Tempura Shrimp', description: 'Lightly battered fried shrimp', type: 'NON_VEGETARIAN', price: 9.99 },
        { id: 'd30', name: 'Green Tea Ice Cream', description: 'Japanese green tea flavored', type: 'VEGETARIAN', price: 5.99 }
      ],
      'rest4': [
        { id: 'd31', name: 'Beef Tacos', description: 'Seasoned beef, lettuce, cheese, salsa', type: 'NON_VEGETARIAN', price: 9.99 },
        { id: 'd32', name: 'Chicken Quesadilla', description: 'Grilled chicken, cheese, peppers', type: 'NON_VEGETARIAN', price: 11.99 },
        { id: 'd33', name: 'Veggie Burrito', description: 'Black beans, rice, veggies, guacamole', type: 'VEGETARIAN', price: 10.49 },
        { id: 'd34', name: 'Nachos Supreme', description: 'Chips, cheese, jalapeños, sour cream', type: 'VEGETARIAN', price: 8.99 },
        { id: 'd35', name: 'Fish Tacos', description: 'Grilled fish, cabbage slaw, lime crema', type: 'NON_VEGETARIAN', price: 12.99 },
        { id: 'd36', name: 'Churros', description: 'Cinnamon sugar churros with chocolate', type: 'VEGETARIAN', price: 5.99 }
      ],
      'rest5': [
        { id: 'd37', name: 'Pad Thai', description: 'Stir-fried noodles, peanuts, lime', type: 'NON_VEGETARIAN', price: 13.99 },
        { id: 'd38', name: 'Green Curry', description: 'Coconut curry with vegetables', type: 'VEGETARIAN', price: 12.99 },
        { id: 'd39', name: 'Tom Yum Soup', description: 'Spicy and sour Thai soup', type: 'NON_VEGETARIAN', price: 8.99 },
        { id: 'd40', name: 'Spring Rolls', description: 'Fresh vegetables wrapped in rice paper', type: 'VEGAN', price: 6.99 },
        { id: 'd41', name: 'Mango Sticky Rice', description: 'Sweet coconut rice with fresh mango', type: 'VEGAN', price: 7.99 }
      ],
      'rest6': [
        { id: 'd42', name: 'Chicken Tikka Masala', description: 'Creamy tomato curry with chicken', type: 'NON_VEGETARIAN', price: 14.99 },
        { id: 'd43', name: 'Palak Paneer', description: 'Spinach curry with cottage cheese', type: 'VEGETARIAN', price: 12.99 },
        { id: 'd44', name: 'Butter Chicken', description: 'Rich and creamy chicken curry', type: 'NON_VEGETARIAN', price: 15.99 },
        { id: 'd45', name: 'Garlic Naan', description: 'Soft flatbread with garlic butter', type: 'VEGETARIAN', price: 3.99 },
        { id: 'd46', name: 'Samosas', description: 'Crispy pastry with spiced potatoes', type: 'VEGETARIAN', price: 5.99 },
        { id: 'd47', name: 'Biryani', description: 'Fragrant rice with spices and meat', type: 'NON_VEGETARIAN', price: 16.99 }
      ],
      'rest7': [
        { id: 'd48', name: 'Kung Pao Chicken', description: 'Spicy stir-fry with peanuts', type: 'NON_VEGETARIAN', price: 13.99 },
        { id: 'd49', name: 'Vegetable Lo Mein', description: 'Soft noodles with mixed vegetables', type: 'VEGETARIAN', price: 11.99 },
        { id: 'd50', name: 'Sweet and Sour Pork', description: 'Crispy pork in tangy sauce', type: 'NON_VEGETARIAN', price: 14.99 },
        { id: 'd51', name: 'Spring Rolls', description: 'Crispy rolls with vegetables', type: 'VEGETARIAN', price: 6.99 },
        { id: 'd52', name: 'Fried Rice', description: 'Wok-fried rice with eggs and vegetables', type: 'VEGETARIAN', price: 9.99 }
      ],
      'rest8': [
        { id: 'd53', name: 'Tonkotsu Ramen', description: 'Rich pork bone broth with noodles', type: 'NON_VEGETARIAN', price: 15.99 },
        { id: 'd54', name: 'Spicy Miso Ramen', description: 'Miso broth with chili oil', type: 'NON_VEGETARIAN', price: 14.99 },
        { id: 'd55', name: 'Vegetable Ramen', description: 'Light vegetable broth with noodles', type: 'VEGETARIAN', price: 13.99 },
        { id: 'd56', name: 'Gyoza', description: 'Pan-fried dumplings', type: 'NON_VEGETARIAN', price: 7.99 },
        { id: 'd57', name: 'Takoyaki', description: 'Octopus balls with bonito flakes', type: 'NON_VEGETARIAN', price: 8.99 }
      ]
    };

    return dishes[restaurantId] || [];
  }

  getToppingsForRestaurant(restaurantId: string): ToppingOption[] {
    const base: ToppingOption[] = [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 1.5, description: 'Creamy mozzarella topping', compatibleTypes: ['VEGETARIAN', 'NON_VEGETARIAN'] },
      { id: 'extra-sauce', name: 'Extra Sauce', price: 0.75, description: 'House special dipping sauce' },
      { id: 'gluten-free', name: 'Gluten Free Base', price: 2.0, description: 'Swap to gluten free base', compatibleTypes: ['VEGETARIAN', 'VEGAN'] },
      { id: 'double-protein', name: 'Double Protein', price: 3.25, description: 'Add more meat or tofu', compatibleTypes: ['NON_VEGETARIAN', 'VEGAN'] },
      { id: 'avocado', name: 'Add Avocado', price: 2.5, description: 'Fresh sliced avocado', compatibleTypes: ['VEGETARIAN', 'VEGAN'] }
    ];

    // Could tailor toppings per restaurant/cuisine later
    return base.map(t => ({ ...t }));
  }
}
