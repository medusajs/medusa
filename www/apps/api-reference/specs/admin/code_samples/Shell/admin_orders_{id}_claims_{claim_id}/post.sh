curl -X POST '{backend_url}/admin/orders/{id}/claims/{claim_id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "no_notification": true
}'
