export function setActionReference(existing, action, options) {
  if (options?.addActionReferenceToObject) {
    existing.actions ??= []
    existing.actions.push(action)
  }
}
