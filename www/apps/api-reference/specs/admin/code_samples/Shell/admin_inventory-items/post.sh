curl -X POST '{backend_url}/admin/inventory-items' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sku": "{value}",
  "hs_code": "{value}",
  "weight": 4900108260868096,
  "length": 1848296115011584,
  "height": 628972834521088,
  "width": 7780141935624192,
  "origin_country": "{value}",
  "mid_code": "{value}",
  "material": "{value}",
  "title": "{value}",
  "description": "{value}",
  "thumbnail": "{value}",
  "metadata": {}
}'