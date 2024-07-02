curl -X POST '{backend_url}/store/carts/{id}/line-items/{line_id}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "quantity": 8980402259623936,
  "metadata": {}
}'