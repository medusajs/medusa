curl -X POST '{backend_url}/admin/pricing/rule-types' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Thurman",
  "rule_attribute": "{value}",
  "default_priority": 4640267816665088
}'