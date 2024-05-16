curl -X POST '{backend_url}/admin/tax-rates/{id}/rules' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "reference": "{value}",
  "reference_id": "{value}"
}'