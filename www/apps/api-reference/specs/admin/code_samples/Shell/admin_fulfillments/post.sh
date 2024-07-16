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
      "quantity": 4971752394326016,
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
  "packed_at": "2024-08-02T08:08:57.631Z",
  "shipped_at": "2024-10-09T23:47:14.965Z",
  "delivered_at": "2024-12-24T20:37:31.054Z",
  "canceled_at": "2025-04-03T16:10:05.988Z",
  "metadata": {}
}'