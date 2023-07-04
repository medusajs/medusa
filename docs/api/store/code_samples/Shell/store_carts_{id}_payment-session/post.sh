curl --location --request POST 'https://medusa-url.com/store/carts/{id}/payment-sessions' \
--header 'Content-Type: application/json' \
--data-raw '{
    "provider_id": "manual"
}'
