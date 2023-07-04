curl --location --request POST 'https://medusa-url.com/admin/tax-rates' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST",
    "name": "New Tax Rate",
    "region_id": "{region_id}"
}'
