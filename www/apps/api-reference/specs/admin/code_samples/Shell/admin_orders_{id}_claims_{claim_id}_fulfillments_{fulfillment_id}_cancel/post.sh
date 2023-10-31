curl -X POST '{backend_url}/admin/orders/{id}/claims/{claim_id}/fulfillments/{fulfillment_id}/cancel' \
-H 'x-medusa-access-token: {api_token}'
