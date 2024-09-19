curl -X POST '{backend_url}/admin/regions/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'