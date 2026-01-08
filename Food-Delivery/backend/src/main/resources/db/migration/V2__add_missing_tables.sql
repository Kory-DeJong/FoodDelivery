-- Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'ROLE_USER'
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(128),
    line1 VARCHAR(255),
    line2 VARCHAR(255),
    city VARCHAR(128),
    postal_code VARCHAR(64),
    country VARCHAR(128),
    is_default BOOLEAN DEFAULT FALSE
);

-- Favorite restaurants
CREATE TABLE IF NOT EXISTS favorite_restaurants (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(64) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT uq_favorite_user_restaurant UNIQUE (user_id, restaurant_id)
);

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
    code VARCHAR(64) PRIMARY KEY,
    code_type VARCHAR(32) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Order item extras
CREATE TABLE IF NOT EXISTS order_item_extras (
    order_item_id BIGINT NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    extra_id VARCHAR(64) NOT NULL,
    name VARCHAR(255),
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (order_item_id, extra_id)
);

-- Orders: add discount fields used by the domain model
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS discount_strategy VARCHAR(64);
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS promo_code VARCHAR(64);
