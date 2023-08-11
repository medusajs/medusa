curl -X POST 'https://medusa-url.com/store/payment-collections/{id}/sessions/batch' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sessions": [
    {
      "provider_id": "stripe",
      "amount": 5000
    },
    {
      "provider_id": "manual",
      "amount": 5000
    }
  ]
}'
