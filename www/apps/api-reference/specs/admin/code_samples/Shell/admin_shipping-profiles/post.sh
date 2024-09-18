curl -X POST '{backend_url}/admin/shipping-profiles' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Percy",
  "type": "{value}",
  "metadata": {}
}'