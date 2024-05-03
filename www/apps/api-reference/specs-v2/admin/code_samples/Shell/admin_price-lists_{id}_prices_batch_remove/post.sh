curl -X POST '{backend_url}/admin/price-lists/{id}/prices/batch/remove' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "ids": [
    "{value}"
  ]
}'