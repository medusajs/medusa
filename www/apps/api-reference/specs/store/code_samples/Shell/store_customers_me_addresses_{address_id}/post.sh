curl -X POST '{backend_url}/store/customers/me/addresses/{address_id}' \
-H 'x-medusa-access-token: {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Gina"
}'
