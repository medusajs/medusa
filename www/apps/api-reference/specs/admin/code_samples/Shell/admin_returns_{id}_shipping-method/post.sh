curl -X POST '{backend_url}/admin/returns/{id}/shipping-method' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "shipping_option_id": "{value}"
}'