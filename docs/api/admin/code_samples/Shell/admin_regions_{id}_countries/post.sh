curl -X POST 'https://medusa-url.com/admin/regions/{region_id}/countries' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "country_code": "dk"
}'
