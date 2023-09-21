curl -X POST '{backend_url}/admin/reservations/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "quantity": 3,
}'
