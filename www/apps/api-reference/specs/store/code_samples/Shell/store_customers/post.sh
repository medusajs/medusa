curl -X POST '{backend_url}/store/customers' \
-H 'Authorization: Bearer {token}' \
-H 'Content-Type: application/json' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
--data-raw '{
  "email": "Monserrate.Leannon88@yahoo.com",
  "company_name": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}"
}'