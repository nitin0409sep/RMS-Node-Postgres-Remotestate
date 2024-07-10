-- ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id INTEGER,
    role_name VARCHAR(200)
);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name VARCHAR(200) NOT NULL,
    user_email VARCHAR(200) NOT NULL,
    user_password VARCHAR(200) NOT NULL,
    created_by INTEGER NOT NULL,
    user_roles INTEGER[],
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS addresses (
    address_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    address_name VARCHAR(200),
    latitude VARCHAR(200),
    longitude VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_name VARCHAR(200),
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DISHES TABLE
CREATE TABLE IF NOT EXISTS dishes (
    dish_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dish_name VARCHAR(200),
    restaurant_id UUID REFERENCES restaurants(restaurant_id),
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INSERT ROLES INTO ROLES TABLE
INSERT INTO roles (role_id, role_name)
VALUES (1, 'Admin'), (2, 'Subadmin'), (3, 'User');

-- INSERT ADMIN INTO USERS TABLE
INSERT INTO users (user_name, user_email, user_password, created_by, user_roles)
VALUES ('Nitin', 'admin@admin.com', '$2b$10$XA.G81OYsrcLNowGbSfXxeAaZgN/uN8z.3JrJJf6lh3Q9RDubiseC', 1, '{1}');
