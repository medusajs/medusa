curl -X POST '{backend_url}/admin/product-types' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "value": "{value}",
  "metadata": {}
}'