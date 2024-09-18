curl -X POST '{backend_url}/admin/tax-rates' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Kaylin",
  "tax_region_id": "{value}",
  "metadata": {}
}'