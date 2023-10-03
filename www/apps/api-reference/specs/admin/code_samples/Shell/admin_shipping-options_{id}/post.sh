curl -X POST '{backend_url}/admin/shipping-options/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "requirements": [
      {
        "type": "max_subtotal",
        "amount": 1000
      }
    ]
}'
