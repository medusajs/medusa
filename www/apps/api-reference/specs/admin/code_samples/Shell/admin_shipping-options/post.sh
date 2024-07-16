curl -X POST '{backend_url}/admin/shipping-options' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Ezequiel",
  "service_zone_id": "{value}",
  "shipping_profile_id": "{value}",
  "price_type": "{value}",
  "provider_id": "{value}",
  "type": {
    "label": "{value}",
    "description": "{value}",
    "code": "{value}"
  },
  "prices": []
}'