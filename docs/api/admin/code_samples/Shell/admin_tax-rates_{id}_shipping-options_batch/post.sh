curl --location --request POST 'https://medusa-url.com/admin/tax-rates/{id}/shipping-options/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
   "shipping_options": [
     "{shipping_option_id}"
   ]
}'
