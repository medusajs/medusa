curl -X POST '{backend_url}/admin/campaigns/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}",
  "starts_at": "2025-06-04T22:59:25.399Z",
  "ends_at": "2024-09-11T21:02:38.319Z"
}'