export const removeNullish = (obj: Record<string, unknown>) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})
