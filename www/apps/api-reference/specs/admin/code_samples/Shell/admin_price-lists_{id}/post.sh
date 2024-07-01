curl -X POST '{backend_url}/admin/price-lists/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}",
  "starts_at": "{value}",
  "ends_at": "{value}"
}'