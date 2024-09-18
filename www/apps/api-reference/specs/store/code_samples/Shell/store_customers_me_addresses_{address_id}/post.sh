curl -X POST '{backend_url}/store/customers/me/addresses/{address_id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \ \
-H 'x-publishable-api-key: {your_publishable_api_key}'
--data-raw '{
  "first_name": "{value}",
}'