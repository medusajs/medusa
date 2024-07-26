import { readdirSync, existsSync, readFileSync, writeFileSync } from "fs"
import { getDmlOutputBasePath } from "../utils/get-output-base-paths.js"
import path from "path"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import { DmlFile } from "../types/index.js"
import toJsonFormatted from "../utils/to-json-formatted.js"

export default async function () {
  console.log("Cleaning DML JSON files...")

  const dmlOutputPath = getDmlOutputBasePath()
  const monorepoRoot = getMonorepoRoot()

  const jsonFiles = readdirSync(dmlOutputPath)

  jsonFiles.forEach((jsonFile) => {
    const jsonFilePath = path.join(dmlOutputPath, jsonFile)
    const parsedJson = JSON.parse(
      readFileSync(jsonFilePath, "utf-8")
    ) as DmlFile

    const dataModelKeys = Object.keys(parsedJson)
    let dataUpdated = false

    dataModelKeys.forEach((dataModelName) => {
      const { filePath } = parsedJson[dataModelName]

      const fullFilePath = path.join(monorepoRoot, filePath)

      if (existsSync(fullFilePath)) {
        return
      }

      // delete data model from json object
      delete parsedJson[dataModelName]
      dataUpdated = true
    })

    if (dataUpdated) {
      writeFileSync(jsonFilePath, toJsonFormatted(parsedJson))
    }
  })
}
