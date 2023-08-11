curl -X POST 'https://medusa-url.com/store/carts/{id}/payment-sessions' \
-H 'Content-Type: application/json' \
--data-raw '{
    "provider_id": "manual"
}'
