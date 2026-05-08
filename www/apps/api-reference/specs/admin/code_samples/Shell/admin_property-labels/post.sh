curl -X POST '{backend_url}/admin/property-labels' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "entity": "{value}",
  "property": "{value}",
  "label": "{value}"
}'