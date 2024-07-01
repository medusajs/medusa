curl -X POST '{backend_url}/admin/products' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}"
}'