curl -X POST '{backend_url}/admin/fulfillment/shipping-options/{id}/rules/batch/remove' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "rule_ids": [
    "{value}"
  ]
}'