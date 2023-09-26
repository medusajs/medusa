curl -X POST '{backend_url}/admin/customer-groups/{id}/customers/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "customer_ids": [
        {
            "id": "cus_01G2Q4BS9GAHDBMDEN4ZQZCJB2"
        }
    ]
}'
