curl -X POST '{backend_url}/admin/inventory-items/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sku": "{value}",
  "hs_code": "{value}",
  "weight": 2984593265262592,
  "length": 6212742914506752,
  "height": 7506841523191808,
  "width": 3012218239057920,
  "origin_country": "{value}",
  "mid_code": "{value}",
  "material": "{value}",
  "title": "{value}",
  "description": "{value}",
  "thumbnail": "{value}",
  "metadata": {}
}'