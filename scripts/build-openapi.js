#!/usr/bin/env node

const fs = require("fs/promises")
const path = require("path")
const execa = require("execa")
const yaml = require("js-yaml")

const isDryRun = process.argv.indexOf("--dry-run") !== -1
const basePath = path.resolve(__dirname, `../`)
const docsApiPath = path.resolve(basePath, "docs/api/")

const run = async () => {
  await generateOASSource()

  if (isDryRun) {
    return
  }
  for (const apiType of ["store", "admin"]) {
    const inputJsonFile = path.resolve(docsApiPath, `${apiType}.oas.json`)
    const outputYamlFile = path.resolve(docsApiPath, `${apiType}.oas.yaml`)

    await jsonFileToYamlFile(inputJsonFile, outputYamlFile)
    await sanitizeOAS(apiType)
    await generateReference(apiType)
  }
}

const generateOASSource = async () => {
  const params = ["oas", `--outDir=${docsApiPath}`, "--verbose"]
  if (isDryRun) {
    params.push("--dryRun")
  }
  const { all: logs } = await execa("medusa-oas-cli", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}

const jsonFileToYamlFile = async (inputJsonFile, outputYamlFile) => {
  const jsonString = await fs.readFile(inputJsonFile, "utf8")
  const jsonObject = JSON.parse(jsonString)
  const yamlString = yaml.dump(jsonObject)
  await fs.writeFile(outputYamlFile, yamlString, "utf8")
}

const sanitizeOAS = async (apiType) => {
  const srcFile = path.resolve(docsApiPath, `${apiType}.oas.yaml`)
  const { all: logs } = await execa(
    "redocly",
    [
      "bundle",
      srcFile,
      `--output=${srcFile}`,
      "--config=docs-util/redocly/config.yaml",
    ],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const generateReference = async (apiType) => {
  const srcFile = path.resolve(docsApiPath, `${apiType}.oas.yaml`)
  const outDir = path.resolve(docsApiPath, `${apiType}`)
  await fs.rm(outDir, { recursive: true, force: true })
  const { all: logs } = await execa(
    "redocly",
    ["split", srcFile, `--outDir=${outDir}`],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

void (async () => {
  await run()
})()
