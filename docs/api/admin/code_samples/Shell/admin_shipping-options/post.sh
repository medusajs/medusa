curl -X POST 'https://medusa-url.com/admin/shipping-options' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "PostFake",
    "region_id": "afasf",
    "provider_id": "manual",
    "data": {},
    "price_type": "flat_rate"
}'
