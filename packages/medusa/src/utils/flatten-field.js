export const flattenField = (list, field) => {
  return list.map(el => el[field])
}
