curl -X DELETE '{backend_url}/admin/publishable-api-keys/{id}/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "sales_channel_ids": [
      {
        "id": "{sales_channel_id}"
      }
    ]
}'
