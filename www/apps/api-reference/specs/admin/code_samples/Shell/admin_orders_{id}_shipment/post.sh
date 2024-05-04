curl -X POST '{backend_url}/admin/orders/{id}/shipment' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "fulfillment_id": "{fulfillment_id}"
}'
