curl -X POST '{backend_url}/admin/product-categories' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Vesta",
  "parent_category_id": "{value}",
  "metadata": {}
}'