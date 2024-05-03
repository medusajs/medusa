curl -X POST '{backend_url}/admin/fulfillment/shipping-options/{id}/rules/batch/add' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "rules": [
    {
      "attribute": "{value}"
    }
  ]
}'