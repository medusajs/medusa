curl -X POST '{backend_url}/admin/claims' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "type": "{value}",
  "order_id": "{value}",
  "metadata": {}
}'