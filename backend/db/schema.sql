/* =================================
   POS SAAS DATABASE SCHEMA
================================= */


/* =================================
   USERS
================================= */

CREATE TABLE users (

id VARCHAR(50) PRIMARY KEY,

name VARCHAR(120),

email VARCHAR(120) UNIQUE,

password TEXT,

role VARCHAR(30),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


/* =================================
   RESTAURANTS
================================= */

CREATE TABLE restaurants (

id VARCHAR(50) PRIMARY KEY,

name VARCHAR(150),

owner_id VARCHAR(50),

currency VARCHAR(10) DEFAULT '₽',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


/* =================================
   TABLES
================================= */

CREATE TABLE tables (

id VARCHAR(50) PRIMARY KEY,

restaurant_id VARCHAR(50),

name VARCHAR(100),

capacity INTEGER,

status VARCHAR(20) DEFAULT 'free'

);


/* =================================
   MENU CATEGORIES
================================= */

CREATE TABLE categories (

id VARCHAR(50) PRIMARY KEY,

restaurant_id VARCHAR(50),

name VARCHAR(100)

);


/* =================================
   MENU ITEMS
================================= */

CREATE TABLE menu (

id VARCHAR(50) PRIMARY KEY,

restaurant_id VARCHAR(50),

category_id VARCHAR(50),

name VARCHAR(150),

price NUMERIC(10,2),

active BOOLEAN DEFAULT TRUE

);


/* =================================
   ORDERS
================================= */

CREATE TABLE orders (

id VARCHAR(50) PRIMARY KEY,

number VARCHAR(50),

restaurant_id VARCHAR(50),

table_id VARCHAR(50),

status VARCHAR(30),

subtotal NUMERIC(10,2),

tax NUMERIC(10,2),

tips NUMERIC(10,2),

total NUMERIC(10,2),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


/* =================================
   ORDER ITEMS
================================= */

CREATE TABLE order_items (

id VARCHAR(50) PRIMARY KEY,

order_id VARCHAR(50),

menu_id VARCHAR(50),

name VARCHAR(150),

price NUMERIC(10,2),

qty INTEGER

);


/* =================================
   PAYMENTS
================================= */

CREATE TABLE payments (

id VARCHAR(50) PRIMARY KEY,

order_id VARCHAR(50),

method VARCHAR(20),

amount NUMERIC(10,2),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


/* =================================
   INVENTORY
================================= */

CREATE TABLE inventory (

id VARCHAR(50) PRIMARY KEY,

restaurant_id VARCHAR(50),

name VARCHAR(150),

qty NUMERIC(10,2)

);


/* =================================
   INVENTORY RECIPES
================================= */

CREATE TABLE recipes (

id VARCHAR(50) PRIMARY KEY,

menu_id VARCHAR(50),

ingredient_id VARCHAR(50),

qty NUMERIC(10,2)

);


/* =================================
   INDEXES
================================= */

CREATE INDEX idx_orders_restaurant
ON orders(restaurant_id);

CREATE INDEX idx_orders_table
ON orders(table_id);

CREATE INDEX idx_menu_category
ON menu(category_id);

CREATE INDEX idx_order_items_order
ON order_items(order_id);


/* =================================
   DEMO DATA
================================= */

INSERT INTO restaurants (id,name,currency)
VALUES ('r1','Demo Cafe','€');


INSERT INTO users (id,name,email,role)
VALUES ('u1','Admin','admin@demo.com','admin');


INSERT INTO tables (id,restaurant_id,name,capacity)
VALUES
('t1','r1','Table 1',4),
('t2','r1','Table 2',4),
('t3','r1','Table 3',4),
('t4','r1','Table 4',4),
('t5','r1','Table 5',4),
('t6','r1','Table 6',4);


INSERT INTO categories (id,restaurant_id,name)
VALUES
('c1','r1','Pizza'),
('c2','r1','Pasta'),
('c3','r1','Drinks');


INSERT INTO menu (id,restaurant_id,category_id,name,price)
VALUES
('m1','r1','c1','Margherita',8.5),
('m2','r1','c1','Pepperoni',9.5),
('m3','r1','c2','Carbonara',7),
('m4','r1','c3','Cola',2);
