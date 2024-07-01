curl -X POST '{backend_url}/store/customers/me' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "company_name": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}"
}'