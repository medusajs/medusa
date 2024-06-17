export function setActionReference(existing, action) {
  existing.detail.order_id ??= action.order_id
  existing.detail.return_id ??= action.return_id
  existing.detail.claim_id ??= action.claim_id
  existing.detail.exchange_id ??= action.exchange_id
}
