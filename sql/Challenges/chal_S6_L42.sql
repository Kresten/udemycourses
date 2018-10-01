-- How many payments did each staff member handle? 
-- And how much was the total amount processed by each staff member?
SELECT staff_id, COUNT(payment_id), SUM(amount)
FROM payment
GROUP BY staff_id;

-- What is the average replacement cost of movies by rating?
SELECT rating, ROUND(AVG(replacement_cost),2)
FROM film
GROUP BY rating;

-- Get the customer ids of the top 5 customers who have spent the most amount of money
SELECT customer_id, SUM(amount)
FROM payment
GROUP BY customer_id
ORDER BY SUM(amount) DESC
LIMIT 5;