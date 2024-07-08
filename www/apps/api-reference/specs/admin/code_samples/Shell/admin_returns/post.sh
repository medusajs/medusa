curl -X POST '{backend_url}/admin/returns' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "order_id": "{value}",
  "items": [
    {
      "id": "id_7DO5H2LbSN3p7IzB",
      "quantity": 1357590174892032,
      "reason_id": "{value}",
      "note": "{value}"
    }
  ],
  "return_shipping": {
    "option_id": "{value}",
    "price": 5112171463704576
  },
  "internal_note": "{value}",
  "location_id": "{value}"
}'