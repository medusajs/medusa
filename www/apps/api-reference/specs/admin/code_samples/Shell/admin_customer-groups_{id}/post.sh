curl -X POST '{backend_url}/admin/customer-groups/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'