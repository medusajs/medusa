curl -X POST '{backend_url}/store/customers/me/addresses' \
-H 'Cookie: connect.sid={sid}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "address": {
      "first_name": "Celia",
      "last_name": "Schumm",
      "address_1": "225 Bednar Curve",
      "city": "Danielville",
      "country_code": "US",
      "postal_code": "85137"
    }
}'
