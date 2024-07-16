curl -X POST '{backend_url}/admin/stores/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "default_sales_channel_id": "{value}",
  "default_region_id": "{value}",
  "default_location_id": "{value}",
  "metadata": {}
}'