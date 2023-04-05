curl --location --request POST 'https://medusa-url.com/admin/reservations/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
   "quantity": 3,
}'
