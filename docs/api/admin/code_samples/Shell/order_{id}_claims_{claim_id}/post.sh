curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/claims/{claim_id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "no_notification": true
}'
