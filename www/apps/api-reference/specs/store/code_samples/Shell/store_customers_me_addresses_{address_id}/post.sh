curl -X POST '{backend_url}/store/customers/me/addresses/{address_id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Gina"
}'
