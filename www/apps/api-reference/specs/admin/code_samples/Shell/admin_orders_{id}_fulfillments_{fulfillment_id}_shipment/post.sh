curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/shipment' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "items": [
    {
      "id": "id_eyih2debIPWMK4kaHGPZ",
      "quantity": 7476297089417216
    }
  ],
  "metadata": {}
}'