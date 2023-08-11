curl -X POST 'https://medusa-url.com/store/customers/me' \
-H 'Cookie: connect.sid={sid}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Laury"
}'
