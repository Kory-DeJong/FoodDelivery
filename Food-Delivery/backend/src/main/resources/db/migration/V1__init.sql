-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    phone_number VARCHAR(64),
    rating DOUBLE PRECISION,
    cuisine_type VARCHAR(128),
    primary_type VARCHAR(64),
    image VARCHAR(512)
);

-- Dishes
CREATE TABLE IF NOT EXISTS dishes (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(64) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    restaurant_id VARCHAR(64) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    restaurant_id VARCHAR(64) REFERENCES restaurants(id),
    restaurant_name VARCHAR(255),
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(64) NOT NULL,
    order_time TIMESTAMP WITH TIME ZONE,
    delivery_address VARCHAR(255),
    contact_phone VARCHAR(64),
    payment_method VARCHAR(64),
    special_instructions TEXT
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    dish_id VARCHAR(64) REFERENCES dishes(id),
    quantity INTEGER NOT NULL
);

