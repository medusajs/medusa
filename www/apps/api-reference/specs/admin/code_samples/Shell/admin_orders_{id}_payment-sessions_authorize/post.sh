curl -X POST '{backend_url}/admin/orders/{id}/payment-sessions/authorize' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "payment_session_id": "{value}"
}'