curl -X POST '{backend_url}/admin/inventory-items/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sku": "{value}",
  "hs_code": "{value}",
  "weight": 8979922215239680,
  "length": 667491233693696,
  "height": 6328111551479808,
  "width": 7175104570064896,
  "origin_country": "{value}",
  "mid_code": "{value}",
  "material": "{value}",
  "title": "{value}",
  "description": "{value}",
  "thumbnail": "{value}",
  "metadata": {}
}'