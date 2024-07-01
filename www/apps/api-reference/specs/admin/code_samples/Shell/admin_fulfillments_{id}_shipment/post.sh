curl -X POST '{backend_url}/admin/fulfillments/{id}/shipment' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "labels": [
    {
      "tracking_number": "{value}",
      "tracking_url": "{value}",
      "label_url": "{value}"
    }
  ]
}'