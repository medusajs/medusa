export const removeFalsy = (obj: Record<string, unknown>) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

// == null is also true for undefined
export const removeNullish = (
  obj: Record<string, unknown>
): Record<string, unknown> =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v != null ? ((a[k] = v), a) : a),
    {}
  )
