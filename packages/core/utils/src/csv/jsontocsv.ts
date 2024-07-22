import { json2csv } from "json-2-csv"

export interface ConvertJsonToCsvOptions<T> {}

export const convertJsonToCsv = <T extends object>(
  data: T[],
  options?: ConvertJsonToCsvOptions<T>
) => {
  return json2csv(data, {
    prependHeader: true,
    arrayIndexesAsKeys: true,
    expandNestedObjects: true,
    expandArrayObjects: true,
    unwindArrays: false,
    emptyFieldValue: "",
  })
}
