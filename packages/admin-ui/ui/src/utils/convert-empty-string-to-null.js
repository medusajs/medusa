export const convertEmptyStringToNull = (data) => {
  const obj = { ...data }
  Object.keys(data).forEach((k) => {
    if (obj[k] === "") {
      obj[k] = null
    }
  })
  return obj
}
