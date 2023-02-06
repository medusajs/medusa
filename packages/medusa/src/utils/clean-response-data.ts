import { pick } from "lodash"

/**
 * Filter response data to contain props specified in the fields array.
 *
 * @param data - record or an array of records in the response
 * @param fields - record props allowed in the response
 */
function cleanResponseData<T>(data: T, fields: string[]) {
  if (!fields.length) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((record) => pick(record, fields))
  }

  return pick(data, fields)
}

export { cleanResponseData }
