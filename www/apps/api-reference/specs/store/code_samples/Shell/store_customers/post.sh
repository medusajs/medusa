curl -X POST '{backend_url}/store/customers' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Monserrate.Leannon88@yahoo.com",
  "company_name": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}"
}'