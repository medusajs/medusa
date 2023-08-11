curl -X POST 'https://medusa-url.com/admin/orders/{id}/shipment' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "fulfillment_id": "{fulfillment_id}"
}'
