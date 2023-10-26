curl -X POST '{backend_url}/admin/regions/{region_id}/countries' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "country_code": "dk"
}'
