curl -X POST '{backend_url}/admin/refund-reasons' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "label": "{value}",
  "description": "{value}"
}'