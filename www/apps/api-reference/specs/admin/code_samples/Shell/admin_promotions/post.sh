curl -X POST '{backend_url}/admin/promotions' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}",
  "type": "{value}",
  "campaign_id": "{value}",
  "application_method": {
    "description": "{value}",
    "value": 1841223411171328,
    "currency_code": "{value}",
    "max_quantity": 2960098049654784,
    "type": "{value}",
    "target_type": "{value}",
    "allocation": "{value}",
    "target_rules": [],
    "buy_rules": [],
    "apply_to_quantity": 708643867590656,
    "buy_rules_min_quantity": 3167972149428224
  }
}'