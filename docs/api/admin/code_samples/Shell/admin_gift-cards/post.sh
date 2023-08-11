curl -X POST 'https://medusa-url.com/admin/gift-cards' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "region_id": "{region_id}"
}'
