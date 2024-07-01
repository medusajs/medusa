curl -X POST '{backend_url}/admin/inventory-items' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sku": "{value}",
  "hs_code": "{value}",
  "weight": 2857134683324416,
  "length": 2322256963305472,
  "height": 8391220613087232,
  "width": 1297863250280448,
  "origin_country": "{value}",
  "mid_code": "{value}",
  "material": "{value}",
  "title": "{value}",
  "description": "{value}",
  "thumbnail": "{value}",
  "metadata": {}
}'