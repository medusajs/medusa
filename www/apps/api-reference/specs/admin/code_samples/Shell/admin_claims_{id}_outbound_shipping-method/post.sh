curl -X POST '{backend_url}/admin/claims/{id}/outbound/shipping-method' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "shipping_option_id": "{value}"
}'