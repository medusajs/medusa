import fs from "fs/promises"

export const readJson = async (filePath: string): Promise<unknown> => {
  const jsonString = await fs.readFile(filePath, "utf8")
  return JSON.parse(jsonString)
}

export const writeJson = async (
  filePath: string,
  jsonObject: unknown
): Promise<void> => {
  const jsonString = JSON.stringify(jsonObject)
  await fs.writeFile(filePath, jsonString, "utf8")
}
