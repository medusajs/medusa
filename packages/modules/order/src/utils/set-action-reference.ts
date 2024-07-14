export function setActionReference(existing, action, options) {
  existing.detail ??= {}

  existing.detail.order_id ??= action.order_id
  existing.detail.return_id ??= action.return_id
  existing.detail.claim_id ??= action.claim_id
  existing.detail.exchange_id ??= action.exchange_id

  if (options?.addActionReferenceToObject) {
    existing.actions ??= []
    existing.actions.push(action)
  }
}

export function unsetActionReference(existing, action) {
  if (Array.isArray(existing?.actions)) {
    existing.actions = existing.actions.filter((a) => a.id !== action.id)
  }
}
