import { csv2json } from "json-2-csv"

export interface ConvertCsvToJsonOptions<T> {}

export const convertCsvToJson = <T extends object>(
  data: string,
  options?: ConvertCsvToJsonOptions<T>
): T[] => {
  return csv2json(data, {
    preventCsvInjection: true,
  }) as T[]
}
