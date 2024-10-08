curl -X POST '{backend_url}/admin/product-categories/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "parent_category_id": "{value}",
  "metadata": {}
}'