curl -X POST '{backend_url}/admin/tax-rates' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST",
    "name": "New Tax Rate",
    "region_id": "{region_id}"
}'
