curl -X POST '{backend_url}/admin/promotions/{id}/target-rules/batch/add' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "rules": [
    {
      "attribute": "{value}",
      "values": [
        "{value}"
      ]
    }
  ]
}'