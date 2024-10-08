curl -X POST '{backend_url}/admin/customers/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Daren_Rodriguez-Rutherford93@gmail.com",
  "company_name": "{value}",
  "first_name": "{value}",
  "last_name": "{value}",
  "phone": "{value}",
  "metadata": {}
}'