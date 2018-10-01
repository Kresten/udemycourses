-- What customers have at least a total of 40 transaction payments 
SELECT customer_id, COUNT(payment_id) 
FROM payment 
GROUP BY customer_id
HAVING COUNT(payment_id) >= 40;

-- What movie ratings have an average rental duration of more than 5 days?
SELECT rating, AVG(rental_duration) 
FROM film 
GROUP BY rating
HAVING AVG(rental_duration) > 5;