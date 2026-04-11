curl -X POST '{backend_url}/admin/draft-orders/{id}' \
-H 'Authorization: Bearer {jwt_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "test@test.com"
}'