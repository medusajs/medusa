curl -X DELETE 'https://medusa-url.com/admin/tax-rates/{id}/shipping-options/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "shipping_options": [
     "{shipping_option_id}"
   ]
}'
