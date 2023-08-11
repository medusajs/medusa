curl -X POST 'https://medusa-url.com/admin/regions/{id}/fulfillment-providers' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "provider_id": "manual"
}'
