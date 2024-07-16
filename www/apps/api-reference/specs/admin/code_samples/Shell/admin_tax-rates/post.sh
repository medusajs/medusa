curl -X POST '{backend_url}/admin/tax-rates' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Americo",
  "tax_region_id": "{value}",
  "metadata": {}
}'