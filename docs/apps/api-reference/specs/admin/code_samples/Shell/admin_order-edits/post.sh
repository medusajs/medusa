curl -X POST '{backend_url}/admin/order-edits' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{ "order_id": "my_order_id", "internal_note": "my_optional_note" }'
