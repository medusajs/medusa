curl -X POST '{backend_url}/admin/customers' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Tomas.Toy16@yahoo.com",
  "company_name": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}",
  "metadata": {}
}'