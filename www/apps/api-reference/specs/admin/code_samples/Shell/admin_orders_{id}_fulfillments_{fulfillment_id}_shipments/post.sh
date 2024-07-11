curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/shipments' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "items": [
    {
      "id": "id_5sTwO6Lz9h9W7f1U",
      "quantity": 395722780311552
    }
  ],
  "metadata": {}
}'