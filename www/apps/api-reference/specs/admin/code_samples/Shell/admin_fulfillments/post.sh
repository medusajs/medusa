curl -X POST '{backend_url}/admin/fulfillments' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "location_id": "{value}",
  "provider_id": "{value}",
  "delivery_address": {
    "first_name": "{value}",
    "last_name": "{value}",
    "phone": "{value}",
    "company": "{value}",
    "address_1": "{value}",
    "address_2": "{value}",
    "city": "{value}",
    "country_code": "{value}",
    "province": "{value}",
    "postal_code": "{value}",
    "metadata": {}
  },
  "items": [
    {
      "title": "{value}",
      "sku": "{value}",
      "quantity": 1667318922870784,
      "barcode": "{value}",
      "line_item_id": "{value}",
      "inventory_item_id": "{value}"
    }
  ],
  "labels": [
    {
      "tracking_number": "{value}",
      "tracking_url": "{value}",
      "label_url": "{value}"
    }
  ],
  "order": {},
  "order_id": "{value}",
  "shipping_option_id": "{value}",
  "data": {},
  "packed_at": "2024-11-12T18:37:37.122Z",
  "shipped_at": "2025-04-13T12:39:42.432Z",
  "delivered_at": "2025-01-29T19:05:57.056Z",
  "canceled_at": "2025-02-16T02:12:11.763Z",
  "metadata": {}
}'