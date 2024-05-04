curl -X POST '{backend_url}/store/products/search' \
-H 'Content-Type: application/json' \
--data-raw '{
    "q": "Shirt"
}'
