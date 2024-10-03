curl -X POST '{backend_url}/admin/orders/{id}/fulfillments' \
-H 'Authorization: Bearer {access_token}' \
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