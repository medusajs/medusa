curl --location --request POST 'https://medusa-url.com/admin/discounts' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST",
    "rule": {
       "type": "fixed",
       "value": 10,
       "allocation": "item"
    },
    "regions": ["reg_XXXXXXXX"]
}'
