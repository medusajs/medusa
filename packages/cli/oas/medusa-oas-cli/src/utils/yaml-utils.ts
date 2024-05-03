import fs from "fs/promises"
import * as yaml from "js-yaml"

export const readYaml = async (filePath): Promise<unknown> => {
  const yamlString = await fs.readFile(filePath, "utf8")
  return yaml.load(yamlString)
}

export const writeYaml = async (filePath: string, yamlContent: string): Promise<void> => {
  await fs.writeFile(filePath, yamlContent, "utf8")
}

export const writeYamlFromJson = async (filePath, jsonObject): Promise<void> => {
  const yamlString = yaml.dump(jsonObject)
  await fs.writeFile(filePath, yamlString, "utf8")
}

export const jsonObjectToYamlString = (jsonObject): string => {
  return yaml.dump(jsonObject)
}

export const jsonFileToYamlFile = async (inputJsonFile, outputYamlFile) => {
  const jsonString = await fs.readFile(inputJsonFile, "utf8")
  const jsonObject = JSON.parse(jsonString)
  const yamlString = yaml.dump(jsonObject)
  await fs.writeFile(outputYamlFile, yamlString, "utf8")
}
