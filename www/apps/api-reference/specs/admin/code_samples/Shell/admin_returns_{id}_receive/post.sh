curl -X POST '{backend_url}/admin/returns/{id}/receive' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "return_id": "{value}",
  "items": [
    {
      "id": "id_qfy3t6cU7m8O5cJ5zs",
      "quantity": 6429460591017984,
      "reason_id": "{value}",
      "note": "{value}"
    }
  ],
  "internal_note": "{value}"
}'