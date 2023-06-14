curl --location --request POST 'https://medusa-url.com/admin/order-edits/{id}/items' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{ "variant_id": "variant_01G1G5V2MRX2V3PVSR2WXYPFB6", "quantity": 3 }'
