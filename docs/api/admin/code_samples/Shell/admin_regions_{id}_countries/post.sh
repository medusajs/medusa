curl --location --request POST 'https://medusa-url.com/admin/regions/{region_id}/countries' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "country_code": "dk"
}'
