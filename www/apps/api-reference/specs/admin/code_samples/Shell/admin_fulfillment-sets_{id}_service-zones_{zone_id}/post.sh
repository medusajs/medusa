curl -X POST '{backend_url}/admin/fulfillment-sets/{id}/service-zones/{zone_id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Elvis"
}'