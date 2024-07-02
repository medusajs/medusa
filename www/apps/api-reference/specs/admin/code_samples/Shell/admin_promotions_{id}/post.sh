curl -X POST '{backend_url}/admin/promotions/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "campaign_id": "{value}"
}'