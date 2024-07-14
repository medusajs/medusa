curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/shipments' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "items": [
    {
      "id": "id_j1Fkos0yUEIiyDSity",
      "quantity": 4275412993572864
    }
  ],
  "metadata": {}
}'