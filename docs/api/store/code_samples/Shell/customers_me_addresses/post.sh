curl --location --request POST 'https://medusa-url.com/store/customers/me/addresses' \
--header 'Cookie: connect.sid={sid}' \
--header 'Content-Type: application/json' \
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
