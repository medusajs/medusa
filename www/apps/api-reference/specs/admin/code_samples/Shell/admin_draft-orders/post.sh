curl -X POST '{backend_url}/admin/draft-orders' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sales_channel_id": "{value}",
  "email": "August.McDermott@gmail.com",
  "customer_id": "{value}",
  "region_id": "{value}",
  "currency_code": "{value}",
  "shipping_methods": [
    {
      "shipping_method_id": "{value}",
      "order_id": "{value}",
      "name": "Elyssa",
      "option_id": "{value}"
    }
  ],
  "metadata": {}
}'