curl -X POST '{backend_url}/admin/publishable-api-keys/{pak_id}/batch' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "sales_channel_ids": [
      {
        "id": "{sales_channel_id}"
      }
    ]
}'
