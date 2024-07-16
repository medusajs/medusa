curl -X POST '{backend_url}/admin/fulfillment-sets/{id}/service-zones' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Rebecca"
}'