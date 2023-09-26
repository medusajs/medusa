curl -X POST '{backend_url}/store/carts/{id}/payment-sessions' \
-H 'Content-Type: application/json' \
--data-raw '{
    "provider_id": "manual"
}'
