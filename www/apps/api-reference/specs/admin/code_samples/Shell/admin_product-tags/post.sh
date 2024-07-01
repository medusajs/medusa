curl -X POST '{backend_url}/admin/product-tags' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "value": "{value}",
  "metadata": {}
}'