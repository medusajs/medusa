curl -X POST '{backend_url}/admin/customers/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Sterling_Tromp91@yahoo.com",
  "company_name": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}",
  "metadata": {}
}'