curl -X POST '{backend_url}/store/customers/me' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Laury"
}'
