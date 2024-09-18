curl -X POST '{backend_url}/admin/products/{id}/variants' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}",
  "prices": []
}'