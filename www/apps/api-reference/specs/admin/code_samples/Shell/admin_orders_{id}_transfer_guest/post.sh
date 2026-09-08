curl -X POST '{backend_url}/admin/orders/{id}/transfer/guest' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Eda_Kuhic78@gmail.com"
}'