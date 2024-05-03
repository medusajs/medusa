curl -X POST '{backend_url}/admin/price-lists/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "prices": [
    {
      "currency_code": "{value}",
      "amount": 1670236243755008,
      "variant_id": "{value}"
    }
  ]
}'