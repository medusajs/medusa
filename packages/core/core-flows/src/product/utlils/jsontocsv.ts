import { json2csv } from "json-2-csv"

export interface ConvertJsonToCsvOptions<T> {
  sortHeader?: boolean | ((aKey: string, bKey: string) => number)
}

export const convertJsonToCsv = <T extends object>(
  data: T[],
  options?: ConvertJsonToCsvOptions<T>
) => {
  return json2csv(data, {
    prependHeader: true,
    sortHeader: options?.sortHeader ?? false,
    arrayIndexesAsKeys: true,
    expandNestedObjects: true,
    expandArrayObjects: true,
    unwindArrays: false,
    preventCsvInjection: true,
    emptyFieldValue: "",
  })
}
