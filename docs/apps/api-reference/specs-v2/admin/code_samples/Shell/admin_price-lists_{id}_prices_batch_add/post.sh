curl -X POST '{backend_url}/admin/price-lists/{id}/prices/batch/add' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "prices": [
    {
      "currency_code": "{value}",
      "amount": 6595965345595392,
      "variant_id": "{value}"
    }
  ]
}'