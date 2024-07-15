export function setActionReference(existing, action, options) {
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
