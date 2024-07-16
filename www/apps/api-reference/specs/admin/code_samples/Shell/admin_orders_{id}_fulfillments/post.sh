curl -X POST '{backend_url}/admin/orders/{id}/fulfillments' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "items": [
    {
      "id": "id_mt3woXRvA41Y",
      "quantity": 2391489571192832
    }
  ],
  "location_id": "{value}",
  "metadata": {}
}'