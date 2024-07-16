curl -X POST '{backend_url}/store/carts/{id}/line-items' \
-H 'Content-Type: application/json' \
--data-raw '{
  "variant_id": "{value}",
  "quantity": 3217472213745664,
  "metadata": {}
}'