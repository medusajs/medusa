curl -X POST '{backend_url}/admin/tax-rates/{id}/rules' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "reference": "{value}",
  "reference_id": "{value}"
}'