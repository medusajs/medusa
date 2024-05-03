curl -X POST '{backend_url}/admin/shipping-options' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "PostFake",
    "region_id": "afasf",
    "provider_id": "manual",
    "data": {},
    "price_type": "flat_rate"
}'
