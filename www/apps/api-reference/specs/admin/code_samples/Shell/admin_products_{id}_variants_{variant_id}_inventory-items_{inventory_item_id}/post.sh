curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}/inventory-items/{inventory_item_id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "required_quantity": 4918409240248320
}'