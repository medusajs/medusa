export const transformIdableFields = (obj, fields) => {
  const ret = { ...obj }

  for (const key of fields) {
    if (key in obj && typeof key === "string") {
      ret[`${key}_id`] = ret[key]
      delete ret[key]
    }
  }

  return ret
}
