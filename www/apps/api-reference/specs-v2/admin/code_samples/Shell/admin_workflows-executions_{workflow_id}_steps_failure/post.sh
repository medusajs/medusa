curl -X POST '{backend_url}/admin/workflows-executions/{workflow_id}/steps/failure' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "transaction_id": "{value}",
  "step_id": "{value}"
}'