curl -X POST '{backend_url}/admin/regions/{id}/fulfillment-providers' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "provider_id": "manual"
}'
