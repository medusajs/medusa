curl -X DELETE 'https://medusa-url.com/admin/tax-rates/{id}/products/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "products": [
     "{product_id}"
   ]
}'
