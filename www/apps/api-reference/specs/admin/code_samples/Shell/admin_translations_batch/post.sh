curl -X POST '{backend_url}/admin/translations/batch' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
-d '{
  "create": [
    {
      "reference": "product",
      "reference_id": "prod_123",
      "locale_code": "fr-FR",
      "translations": {
        "title": "Chaussures",
        "description": "Des chaussures élégantes."
      }
    }
  ]
}'