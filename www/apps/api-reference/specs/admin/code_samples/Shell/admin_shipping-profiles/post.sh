curl -X POST '{backend_url}/admin/shipping-profiles' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Percy",
  "type": "{value}",
  "metadata": {}
}'