
DROP DATABASE IF EXISTS bamazondb;
CREATE DATABASE bamazondb;

USE bamazondb;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Paper Towels", "Kitchen", 2.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rubber Ducky", "Kids", 7.69, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bathmats", "Baths", 10.10, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Forks", "Kitchen", 1.89, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Spoons", "Kitchen", 1.89, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Knifes", "Kitchen", 1.89, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bread", "Grocery", 3.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gum", "Grocery", .99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Grocery", 1.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sheets", "Beds", 15.00, 8);