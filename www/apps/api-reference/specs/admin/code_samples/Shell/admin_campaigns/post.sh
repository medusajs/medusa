curl -X POST '{backend_url}/admin/campaigns' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Josiane",
  "campaign_identifier": "{value}",
  "description": "{value}",
  "budget": {
    "type": "{value}",
    "limit": 4363120921280512,
    "currency_code": "{value}"
  },
  "starts_at": "2024-12-11T05:49:36.479Z",
  "ends_at": "2025-01-17T06:09:10.778Z"
}'