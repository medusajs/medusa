curl -X POST '{backend_url}/admin/discounts' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST",
    "rule": {
       "type": "fixed",
       "value": 10,
       "allocation": "item"
    },
    "regions": ["reg_XXXXXXXX"]
}'
