curl -X POST '{backend_url}/admin/store-credit-accounts/{id}/credit' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "amount": 39
}'