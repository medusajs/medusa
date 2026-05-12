export const SUPPORTED_FORMATS = [
  "text/csv",
  "application/vnd.ms-excel",
  ".csv",
]
export const SUPPORTED_FORMATS_FILE_EXTENSIONS = [".csv"]

export const isCsvFile = (file: Pick<File, "name" | "type">) => {
  const hasCsvExtension = file.name.toLowerCase().endsWith(".csv")

  return SUPPORTED_FORMATS.includes(file.type) || hasCsvExtension
}
