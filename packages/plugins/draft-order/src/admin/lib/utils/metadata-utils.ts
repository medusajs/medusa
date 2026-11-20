type MetadataField = {
  key: string
  value?: any
  disabled?: boolean
}

export function parseValues(
  values: { metadata: MetadataField[] },
  original?: Record<string, any> | null
): Record<string, any> | null {
  const metadata = values.metadata

  const isEmpty =
    !metadata.length ||
    (metadata.length === 1 && !metadata[0].key && !metadata[0].value)

  if (isEmpty) {
    return null
  }

  const update: Record<string, any> = {}

  // First, handle removed keys from original
  if (original) {
    Object.keys(original).forEach((originalKey) => {
      const exists = metadata.some((field) => field.key === originalKey)
      if (!exists) {
        update[originalKey] = ""
      }
    })
  }

  metadata.forEach((field) => {
    let key = field.key
    let value = field.value
    const disabled = field.disabled

    if (!key) {
      return
    }

    if (disabled) {
      update[key] = value
      return
    }

    key = key.trim()
    value = value?.trim() ?? ""

    // We try to cast the value to a boolean or number if possible
    if (value === "true") {
      update[key] = true
    } else if (value === "false") {
      update[key] = false
    } else {
      const isNumeric = /^-?\d*\.?\d+$/.test(value)
      if (isNumeric) {
        update[key] = parseFloat(value)
      } else {
        update[key] = value
      }
    }
  })

  return update
}
