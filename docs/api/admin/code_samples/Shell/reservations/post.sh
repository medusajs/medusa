curl --location --request POST 'https://medusa-url.com/admin/reservations' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "resource_id": "{resource_id}",
    "resource_type": "order",
    "value": "We delivered this order"
}'
