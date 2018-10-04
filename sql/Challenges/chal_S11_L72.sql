-- Create a table to organize our potential leads! We will have the following information:
-- A customer's first name, last name,email,sign-up date, and number of minutes spent on the dvd rental site. 
-- You should also have some sort of id tracker for them. 

CREATE TABLE leads(
    customer_id serial PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    sign_up TIMESTAMP NOT NULL,
    minutes_spent INTEGER NOT NULL   
);