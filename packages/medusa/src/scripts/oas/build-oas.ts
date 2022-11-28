import * as path from "path"
import * as fs from "fs"

import swaggerInline from "swagger-inline"
import OpenAPIParser from "@readme/openapi-parser"

type ApiType = "store" | "admin"

const run = async () => {
  console.debug("Generate OAS from codebase.")

  const targetDir = path.resolve(__dirname, "../../../", "dist/oas")
  fs.mkdirSync(targetDir, { recursive: true })

  for (const apiType of ["store", "admin"]) {
    console.debug(`Building OAS for ${apiType} api.`)
    const oas = await getOASFromCodebase(apiType as ApiType)
    exportOASToJSON(oas, apiType as ApiType, targetDir)
  }

  console.log("OAS successfully generated.")
}

const getOASFromCodebase = async (apiType: ApiType) => {
  console.debug("Parse JSDoc from path and schema definitions.")
  const gen = await swaggerInline(
    [
      path.resolve(__dirname, "../../", "models"),
      path.resolve(__dirname, "../../", "api/middlewares"),
      path.resolve(__dirname, "../../", `api/routes/${apiType}`),
    ],
    {
      base: path.resolve(__dirname, "./", `${apiType}-spec3-base.yaml`),
      format: ".json",
    }
  )

  console.debug("Get OAS JSON object from OAS JSON string.")
  const oas = await OpenAPIParser.parse(JSON.parse(gen))

  console.debug("Parse Class with class-validator for schema definitions.")
  // TODO: implement

  console.debug("Augment OAS with schemas from classes.")
  // TODO: implement

  console.debug("Validate generated OAS.")
  try {
    await OpenAPIParser.validate(JSON.parse(JSON.stringify(oas)))
  } catch (err) {
    console.warn("OAS validation failed.")
    console.warn(err)
  }

  return oas
}

const exportOASToJSON = (oas, apiType: ApiType, targetDir: string) => {
  console.log("Exporting OAS to JSON.")

  const json = JSON.stringify(oas, null, 2)
  fs.writeFile(path.resolve(targetDir, `${apiType}.oas.json`), json, (err) => {
    if (err) {
      throw err
    }
  })
}

void (async () => {
  await run()
})()
