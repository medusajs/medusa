curl -X POST '{backend_url}/admin/tax-rates/{id}/products/batch' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
   "products": [
     "{product_id}"
   ]
}'
