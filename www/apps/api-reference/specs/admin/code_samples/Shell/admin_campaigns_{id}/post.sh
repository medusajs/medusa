curl -X POST '{backend_url}/admin/campaigns/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}",
  "starts_at": "2024-08-10T14:44:10.530Z",
  "ends_at": "2024-07-13T17:45:37.462Z"
}'