curl -X POST 'https://medusa-url.com/admin/reservations/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "quantity": 3,
}'
