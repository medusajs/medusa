curl -X POST '{backend_url}/admin/promotions' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}",
  "type": "{value}",
  "campaign_id": "{value}",
  "application_method": {
    "description": "{value}",
    "value": 8278663852195840,
    "currency_code": "{value}",
    "max_quantity": 1476637898047488,
    "type": "{value}",
    "target_type": "{value}",
    "allocation": "{value}",
    "target_rules": [],
    "buy_rules": [],
    "apply_to_quantity": 4631179250630656,
    "buy_rules_min_quantity": 2821352643887104
  }
}'