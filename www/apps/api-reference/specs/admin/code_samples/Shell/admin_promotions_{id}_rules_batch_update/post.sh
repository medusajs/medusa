curl -X POST '{backend_url}/admin/promotions/{id}/rules/batch/update' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "rules": [
    {
      "id": "id_orjnxCxIQlJAp4",
      "attribute": "{value}",
      "values": [
        "{value}"
      ]
    }
  ]
}'