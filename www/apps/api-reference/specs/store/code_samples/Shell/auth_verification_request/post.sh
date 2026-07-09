curl -X POST '{backend_url}/auth/verification/request' \
-H 'Content-Type: application/json' \
--data-raw '{
  "entity_id": "customer@example.com",
  "entity_type": "email",
  "code_provider": "token"
}'