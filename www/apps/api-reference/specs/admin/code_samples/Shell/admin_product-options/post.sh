curl -X POST '{backend_url}/admin/product-options' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "cuppedia",
  "values": [
    "{value}"
  ]
}'