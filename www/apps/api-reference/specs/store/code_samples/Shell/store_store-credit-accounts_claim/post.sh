curl -X POST '{backend_url}/store/store-credit-accounts/claim' \
-H 'Authorization: Bearer {access_token}' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}"
}'