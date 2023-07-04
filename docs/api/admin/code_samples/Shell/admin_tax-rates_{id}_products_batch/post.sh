curl --location --request POST 'https://medusa-url.com/admin/tax-rates/{id}/products/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
   "products": [
     "{product_id}"
   ]
}'
