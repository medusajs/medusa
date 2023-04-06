curl --location --request POST 'https://medusa-url.com/admin/invites/accept' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": "{token}",
    "user": {
      "first_name": "Brigitte",
      "last_name": "Collier",
      "password": "supersecret"
    }
}'
