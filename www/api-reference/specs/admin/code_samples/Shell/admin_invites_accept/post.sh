curl -X POST '{backend_url}/admin/invites/accept' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "token": "{token}",
    "user": {
      "first_name": "Brigitte",
      "last_name": "Collier",
      "password": "supersecret"
    }
}'
