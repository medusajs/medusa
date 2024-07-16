curl -X POST '{backend_url}/admin/customer-groups' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Cyrus",
  "metadata": {}
}'