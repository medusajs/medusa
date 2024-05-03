curl -X POST '{backend_url}/admin/price-lists' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}",
  "description": "{value}",
  "prices": [
    {
      "currency_code": "{value}",
      "amount": 1270314195484672,
      "variant_id": "{value}"
    }
  ]
}'