#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const yaml = require("js-yaml")

const run = () => {
  for (const apiType of ["store", "admin"]) {
    const inputJsonFile = path.resolve(
      __dirname,
      "../",
      `packages/medusa/dist/oas/${apiType}.oas.json`
    )
    const outputJsonFile = path.resolve(
      __dirname,
      "../",
      `docs/api/${apiType}-spec3.json`
    )
    const outputYamlFile = path.resolve(
      __dirname,
      "../",
      `docs/api/${apiType}-spec3.yaml`
    )

    fs.copyFileSync(inputJsonFile, outputJsonFile)
    jsonFileToYamlFile(inputJsonFile, outputYamlFile)
    generateReference(apiType)
  }
}

const jsonFileToYamlFile = (inputJsonFile, outputYamlFile) => {
  const jsonString = fs.readFileSync(inputJsonFile, "utf8")
  const jsonObject = JSON.parse(jsonString)
  const yamlString = yaml.dump(jsonObject)
  fs.writeFileSync(outputYamlFile, yamlString, "utf8")
}

const generateReference = (apiType) => {
  exec(
    `rm -rf docs/api/${apiType}/ && yarn run -- redocly split docs/api/${apiType}.oas.yaml --outDir=docs/api/${apiType}/`,
    (error, stdout, stderr) => {
      if (error) {
        throw new Error(`error: ${error.message}`)
      }
      console.log(`${stderr || stdout}`)
    }
  )
}

run()
