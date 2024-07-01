curl -X POST '{backend_url}/admin/campaigns' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Gunner",
  "campaign_identifier": "{value}",
  "description": "{value}",
  "starts_at": "2024-08-24T00:19:14.144Z",
  "ends_at": "2024-10-01T06:47:50.133Z"
}'