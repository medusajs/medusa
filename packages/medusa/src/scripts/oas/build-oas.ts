import * as path from "path"
import { mkdir, writeFile } from "fs/promises"

import swaggerInline from "swagger-inline"
import OpenAPIParser from "@readme/openapi-parser"
import { defaultMetadataStorage } from "class-transformer/cjs/storage"

import { IOptions } from "class-validator-jsonschema/build/options"
import { validationMetadatasToSchemas } from "class-validator-jsonschema"
import { IsTypeJSONSchemaConverter } from "../../utils/validators/is-type"
import { IsNullableJSONSchemaConverter } from "../../utils/validators/is-nullable"
import logger from "../../loaders/logger"

type ApiType = "store" | "admin"

const cliParams = process.argv.slice(2)
const skipJSONSchema = cliParams.includes("--skipJSONSchema")
const isVerbose = cliParams.includes("--verbose") || cliParams.includes("-V")
const onlyValidate = cliParams.includes("--onlyValidate")
const debug = (...args) => {
  if (isVerbose) {
    logger.debug(...args)
  }
}

// Current package root directory
const packagePath = path.resolve(__dirname, "../../../")
// Current package src directory
const basePath = path.resolve(packagePath, "src/")

const run = async () => {
  debug("Generate OAS from codebase.")

  const targetDir = path.resolve(packagePath, "oas/")
  if (!onlyValidate) {
    await mkdir(targetDir, { recursive: true })
  }

  for (const apiType of ["store", "admin"]) {
    debug(`Building OAS for ${apiType} api.`)
    const oas = await getOASFromCodebase(apiType as ApiType, onlyValidate)
    if (!onlyValidate) {
      await exportOASToJSON(oas, apiType as ApiType, targetDir)
    }
  }

  debug("OAS successfully generated.")
}

const getOASFromCodebase = async (apiType: ApiType, validate = false) => {
  debug("Parse JSDoc from path and schema definitions.")
  const gen = await swaggerInline(
    [
      path.resolve(basePath, "models"),
      path.resolve(basePath, "api/middlewares"),
      path.resolve(basePath, `api/routes/${apiType}`),
    ],
    {
      base: path.resolve(basePath, `scripts/oas/${apiType}-spec3-base.yaml`),
      format: ".json",
    }
  )

  debug("Get OAS JSON object from OAS JSON string.")
  const oas = await OpenAPIParser.parse(JSON.parse(gen))

  if (!skipJSONSchema) {
    debug(
      "Register and parse class-validator classes to infer schema definitions."
    )
    await import("../../api")
    await import("../../models")
    const schemas = validationMetadatasToSchemas(getJSONSchemaOptions())

    const jsdocKeys = Object.keys(oas.components.schemas)
    const classKeys = Object.keys(schemas)

    debug("Augment OAS with schemas from classes.")
    Object.assign(oas.components.schemas, schemas)

    if (isVerbose) {
      // List all schemas and their declaration origin.
      for (const key of Object.keys(oas.components.schemas)) {
        debug(
          `${jsdocKeys.includes(key) ? 1 : 0}, ${
            classKeys.includes(key) ? 1 : 0
          }, ${key}`
        )
      }
    }
  }

  debug("Validate generated OAS.")
  try {
    await OpenAPIParser.validate(JSON.parse(JSON.stringify(oas)))
  } catch (err) {
    if (validate) {
      logger.error(`Error in OAS ${apiType}`, err)
      process.exit(1)
    } else {
      debug("OAS validation failed.")
      logger.warn(err)
    }
  }

  return oas
}

const exportOASToJSON = async (oas, apiType: ApiType, targetDir: string) => {
  debug("Exporting OAS to JSON.")

  const json = JSON.stringify(oas, null, 2)
  await writeFile(path.resolve(targetDir, `${apiType}.oas.json`), json)
}

const getJSONSchemaOptions = (): Partial<IOptions> => ({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: "#/components/schemas/",
  additionalConverters: {
    IsNullable: IsNullableJSONSchemaConverter,
    IsType: IsTypeJSONSchemaConverter,
    IsGreaterThan: () => {},
    IsISO8601Duration: () => {},
    ExactlyOne: (meta, _options) => {
      return {
        type: "array",
        items: {
          type: typeof meta.constraints[0].toString(),
        },
        enum: meta.constraints,
      }
    },
  },
})

void (async () => {
  await run()
})()
