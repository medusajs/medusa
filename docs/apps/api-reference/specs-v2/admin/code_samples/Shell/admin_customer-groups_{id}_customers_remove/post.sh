curl -X POST '{backend_url}/admin/customer-groups/{id}/customers/remove' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "customer_ids": [
    {
      "id": "id_oAhMZi39hsjIOqPA6"
    }
  ]
}'