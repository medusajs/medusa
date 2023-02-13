curl --location --request DELETE 'https://medusa-url.com/admin/tax-rates/{id}/product-types/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
   "product_types": [
     "{product_type_id}"
   ]
}'
