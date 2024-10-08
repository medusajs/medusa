curl -X POST '{backend_url}/admin/customer-groups/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Corbin",
  "metadata": {}
}'