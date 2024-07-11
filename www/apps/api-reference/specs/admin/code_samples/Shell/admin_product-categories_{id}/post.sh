curl -X POST '{backend_url}/admin/product-categories/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "parent_category_id": "{value}",
  "metadata": {}
}'