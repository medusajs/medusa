curl -X POST '{backend_url}/admin/orders/{id}/fulfillments' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "items": [
    {
      "id": "id_YePfQ6PBCBKvmYyreUt2",
      "quantity": 6623610359775232
    }
  ],
  "location_id": "{value}",
  "metadata": {}
}'