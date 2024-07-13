curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/shipments' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "items": [
    {
      "id": "id_Cw4XVkx06Ph5R9cO",
      "quantity": 4875752895938560
    }
  ],
  "metadata": {}
}'