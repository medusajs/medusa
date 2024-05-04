curl -X POST '{backend_url}/admin/regions/{id}/fulfillment-providers' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "provider_id": "manual"
}'
