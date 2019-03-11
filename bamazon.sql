CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
     item_id INT AUTO_INCREMENT NOT NULL,
     productname VARCHAR(45) NOT NULL,
     departmentname VARCHAR(45) NOT NULL,
     price DOUBLE NOT NULL,
     stock_quantity INT NOT NULL,
     PRIMARY KEY (item_id)
     ); 

INSERT INTO products (productname, departmentname, price, stock_quantity)
VALUES ("Coffee Mug","Home Goods",19.95,30),
("Anthem","Video Games",59.99,60),
("Devil May Cry 5","Video Games",59.99,60),
("Mac Book Pro 15'","Computers",2000,5),
("Sony Ultra 10k","TV",40000,1),
("Cheese","Food",4.56,40),
("Hello Kitty","Children Toys",5,10),
("Iphone X","Cellphones",2000,5);