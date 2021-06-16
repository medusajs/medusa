/**
 * Takes an object and a list of fields to tranform in that object. If the field
 * exists on the object and its value is a string it will append `_id` to the 
 * field name. This is used when allowing API calls to hold either ID or object
 * values in the payload. The method returns a new object with the 
 * transformation.
 * @param {Object} obj - the object to transform
 * @param {Array<String>} fields - the fields to apply transformation to
 * @returns {Object} the transformed object
 */
export const transformIdableFields = (obj, fields) => {
  const ret = { ...obj }

  for (const key of fields) {
    if (key in obj && typeof ret[key] === "string") {
      ret[`${key}_id`] = ret[key]
      delete ret[key]
    }
  }

  return ret
}
