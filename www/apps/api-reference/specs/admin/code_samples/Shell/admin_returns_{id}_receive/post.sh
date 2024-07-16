curl -X POST '{backend_url}/admin/returns/{id}/receive' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "return_id": "{value}",
  "items": [
    {
      "id": "id_znhTGdV0pxJtj",
      "quantity": 759459062218752,
      "reason_id": "{value}"
    }
  ],
  "internal_note": "{value}"
}'