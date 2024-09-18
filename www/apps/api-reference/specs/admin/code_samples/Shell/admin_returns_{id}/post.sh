curl -X POST '{backend_url}/admin/returns/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'