import { csv2json } from "json-2-csv"

export interface ConvertCsvToJsonOptions<T> {}

export const convertCsvToJson = <T extends object>(
  data: string,
  options?: ConvertCsvToJsonOptions<T>
): T[] => {
  return csv2json(data, {
    preventCsvInjection: true,
    delimiter: { field: detectDelimiter(data) },
  }) as T[]
}

const delimiters = [",", ";", "|"]

const detectDelimiter = (data: string) => {
  let delimiter = ","
  const header = data.split("\n")[0]

  for (const del of delimiters) {
    if (header.split(del).length > 1) {
      delimiter = del
      break
    }
  }

  return delimiter
}
