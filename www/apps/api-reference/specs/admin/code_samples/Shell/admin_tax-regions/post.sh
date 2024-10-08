curl -X POST '{backend_url}/admin/tax-regions' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "country_code": "{value}",
  "province_code": "{value}",
  "parent_id": "{value}",
  "metadata": {}
}'