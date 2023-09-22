curl -X POST '{backend_url}/admin/tax-rates/{id}/product-types/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "product_types": [
     "{product_type_id}"
   ]
}'
