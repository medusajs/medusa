curl -X POST '{backend_url}/store/customers/me/addresses' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \ \
-H 'x-publishable-api-key: {your_publishable_api_key}'
--data-raw '{
  "metadata": {},
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}",
  "company": "{value}",
  "address_1": "{value}",
  "address_2": "{value}",
  "city": "{value}",
  "country_code": "{value}",
  "province": "{value}",
  "postal_code": "{value}",
  "address_name": "{value}"
}'