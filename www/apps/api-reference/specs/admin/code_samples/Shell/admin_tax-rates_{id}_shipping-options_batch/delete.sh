curl -X DELETE '{backend_url}/admin/tax-rates/{id}/shipping-options/batch' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "shipping_options": [
     "{shipping_option_id}"
   ]
}'
