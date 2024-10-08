curl -X POST '{backend_url}/admin/stores/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Melvina",
  "default_sales_channel_id": "{value}",
  "default_region_id": "{value}",
  "default_location_id": "{value}",
  "metadata": {}
}'