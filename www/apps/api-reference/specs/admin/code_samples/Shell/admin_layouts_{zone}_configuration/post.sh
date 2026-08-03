curl -X POST '{backend_url}/admin/layouts/{zone}/configuration' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "configuration": {
    "widgets": {}
  }
}'