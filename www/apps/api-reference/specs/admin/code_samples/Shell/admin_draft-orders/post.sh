curl -X POST '{backend_url}/admin/draft-orders' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "sales_channel_id": "{value}",
  "email": "Bartholome.Goodwin90@yahoo.com",
  "customer_id": "{value}",
  "region_id": "{value}",
  "currency_code": "{value}",
  "shipping_methods": [
    {
      "shipping_method_id": "{value}",
      "order_id": "{value}",
      "name": "Cheyanne",
      "option_id": "{value}"
    }
  ],
  "metadata": {}
}'