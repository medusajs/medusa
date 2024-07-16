curl -X POST '{backend_url}/store/return' \
-H 'Content-Type: application/json' \
--data-raw '{
  "order_id": "{value}",
  "items": [
    {
      "id": "id_rvx2OyGDmWBRNqIB",
      "quantity": 3115300224499712,
      "reason_id": "{value}",
      "note": "{value}"
    }
  ],
  "return_shipping": {
    "option_id": "{value}",
    "price": 6573576243118080
  },
  "note": "{value}",
  "location_id": "{value}"
}'