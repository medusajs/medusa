curl -X POST '{backend_url}/admin/product-categories' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Meda",
  "parent_category_id": "{value}",
  "metadata": {}
}'