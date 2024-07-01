curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}/inventory-items' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "required_quantity": 7390879820021760,
  "inventory_item_id": "{value}"
}'