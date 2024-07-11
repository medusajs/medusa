curl -X POST '{backend_url}/admin/products/{id}/options' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}",
  "values": [
    "{value}"
  ]
}'