curl --location --request POST 'https://medusa-url.com/store/customers/me' \
--header 'Cookie: connect.sid={sid}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Laury"
}'
