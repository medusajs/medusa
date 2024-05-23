import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs"
import { OpenAPIV3 } from "openapi-types"
import path from "path"
import ts from "typescript"
import { parse, stringify } from "yaml"
import GeneratorEventManager from "../classes/helpers/generator-event-manager.js"
import OasSchemaHelper from "../classes/helpers/oas-schema.js"
import OasKindGenerator, { OasArea } from "../classes/kinds/oas.js"
import { DEFAULT_OAS_RESPONSES } from "../constants.js"
import { OpenApiDocument, OpenApiSchema } from "../types/index.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import getOasOutputBasePath from "../utils/get-oas-output-base-path.js"
import parseOas from "../utils/parse-oas.js"

const OAS_PREFIX_REGEX = /@oas \[(?<method>(get|post|delete))\] (?<path>.+)/

export default async function () {
  const oasOutputBasePath = getOasOutputBasePath()
  const oasOperationsPath = path.join(oasOutputBasePath, "operations")
  const apiRoutesPath = path.join(
    getMonorepoRoot(),
    "packages",
    "medusa",
    "src",
    "api"
  )
  const areas: OasArea[] = ["admin", "store"]
  const tags: Map<OasArea, Set<string>> = new Map()
  const oasSchemaHelper = new OasSchemaHelper()
  const referencedSchemas: Set<string> = new Set()
  const allSchemas: Set<string> = new Set()
  areas.forEach((area) => {
    tags.set(area, new Set<string>())
  })

  const testAndFindReferenceSchema = (
    nestedSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  ) => {
    if (oasSchemaHelper.isRefObject(nestedSchema)) {
      referencedSchemas.add(
        oasSchemaHelper.normalizeSchemaName(nestedSchema.$ref)
      )
    } else {
      findReferencedSchemas(nestedSchema)
    }
  }

  const findReferencedSchemas = (schema: OpenApiSchema) => {
    if (schema.properties) {
      Object.values(schema.properties).forEach(testAndFindReferenceSchema)
    } else if (schema.oneOf || schema.allOf || schema.anyOf) {
      Object.values((schema.oneOf || schema.allOf || schema.anyOf)!).forEach(
        testAndFindReferenceSchema
      )
    } else if (schema.type === "array") {
      testAndFindReferenceSchema(schema.items)
    }
  }

  console.log("Cleaning OAS files...")

  // read files under the operations/{area} directory
  areas.forEach((area) => {
    const areaPath = path.join(oasOperationsPath, area)
    if (!existsSync(areaPath)) {
      return
    }

    readdirSync(areaPath, {
      recursive: true,
      encoding: "utf-8",
    }).forEach((oasFile) => {
      const filePath = path.join(areaPath, oasFile)
      const { oas, oasPrefix } = parseOas(readFileSync(filePath, "utf-8")) || {}

      if (!oas || !oasPrefix) {
        return
      }

      // decode oasPrefix
      const matchOasPrefix = OAS_PREFIX_REGEX.exec(oasPrefix)
      if (!matchOasPrefix?.groups?.method || !matchOasPrefix.groups.path) {
        return
      }
      const splitPath = matchOasPrefix.groups.path.substring(1).split("/")

      // normalize path by replacing {paramName} with [paramName]
      const normalizedOasPrefix = splitPath
        .map((item) => item.replace(/^\{(.+)\}$/, "[$1]"))
        .join("/")
      const sourceFilePath = path.join(
        apiRoutesPath,
        normalizedOasPrefix,
        "route.ts"
      )

      // check if a route exists for the path
      if (!existsSync(sourceFilePath)) {
        // remove OAS file
        rmSync(filePath, {
          force: true,
        })
        return
      }

      // check if method exists in the file
      let exists = false
      const program = ts.createProgram([sourceFilePath], {})

      const oasKindGenerator = new OasKindGenerator({
        checker: program.getTypeChecker(),
        generatorEventManager: new GeneratorEventManager(),
        additionalOptions: {},
      })
      const sourceFile = program.getSourceFile(sourceFilePath)

      if (!sourceFile) {
        // remove file
        rmSync(filePath, {
          force: true,
        })
        return
      }

      const visitChildren = (node: ts.Node) => {
        if (
          !exists &&
          oasKindGenerator.isAllowed(node) &&
          oasKindGenerator.canDocumentNode(node) &&
          oasKindGenerator.getHTTPMethodName(node) ===
            matchOasPrefix.groups!.method
        ) {
          exists = true
        } else if (!exists) {
          ts.forEachChild(node, visitChildren)
        }
      }

      ts.forEachChild(sourceFile, visitChildren)

      if (!exists) {
        // remove OAS file
        rmSync(filePath, {
          force: true,
        })
        return
      }

      // collect tags
      oas.tags?.forEach((tag) => {
        const areaTags = tags.get(area as OasArea)
        areaTags?.add(tag)
      })

      // collect schemas
      if (oas.requestBody) {
        if (oasSchemaHelper.isRefObject(oas.requestBody)) {
          referencedSchemas.add(
            oasSchemaHelper.normalizeSchemaName(oas.requestBody.$ref)
          )
        } else {
          const requestBodySchema =
            oas.requestBody.content[Object.keys(oas.requestBody.content)[0]]
              .schema
          if (requestBodySchema) {
            testAndFindReferenceSchema(requestBodySchema)
          }
        }
      }

      if (oas.responses) {
        const successResponseKey = Object.keys(oas.responses)[0]
        if (!Object.keys(DEFAULT_OAS_RESPONSES).includes(successResponseKey)) {
          const responseObj = oas.responses[successResponseKey]
          if (oasSchemaHelper.isRefObject(responseObj)) {
            referencedSchemas.add(
              oasSchemaHelper.normalizeSchemaName(responseObj.$ref)
            )
          } else if (responseObj.content) {
            const responseBodySchema =
              responseObj.content[Object.keys(responseObj.content)[0]].schema
            if (responseBodySchema) {
              testAndFindReferenceSchema(responseBodySchema)
            }
          }
        }
      }
    })
  })

  console.log("Clean tags...")

  // check if any tags should be removed
  const oasBasePath = path.join(oasOutputBasePath, "base")
  readdirSync(oasBasePath, {
    recursive: true,
    encoding: "utf-8",
  }).forEach((baseYaml) => {
    const baseYamlPath = path.join(oasBasePath, baseYaml)
    const parsedBaseYaml = parse(
      readFileSync(baseYamlPath, "utf-8")
    ) as OpenApiDocument

    const area = path.basename(baseYaml).split(".")[0] as OasArea
    const areaTags = tags.get(area)
    if (!areaTags) {
      return
    }
    const lengthBefore = parsedBaseYaml.tags?.length || 0

    parsedBaseYaml.tags = parsedBaseYaml.tags?.filter((tag) =>
      areaTags.has(tag.name)
    )

    if (lengthBefore !== (parsedBaseYaml.tags?.length || 0)) {
      // sort alphabetically
      parsedBaseYaml.tags?.sort((tagA, tagB) => {
        return tagA.name.localeCompare(tagB.name)
      })
      // write to the file
      writeFileSync(baseYamlPath, stringify(parsedBaseYaml))
    }

    // collect referenced schemas
    parsedBaseYaml.tags?.forEach((tag) => {
      if (tag["x-associatedSchema"]) {
        referencedSchemas.add(
          oasSchemaHelper.normalizeSchemaName(tag["x-associatedSchema"].$ref)
        )
      }
    })
  })

  console.log("Clean schemas...")

  // check if any schemas should be removed
  // a schema is removed if no other schemas/operations reference it
  const oasSchemasPath = path.join(oasOutputBasePath, "schemas")
  readdirSync(oasSchemasPath, {
    recursive: true,
    encoding: "utf-8",
  }).forEach((schemaYaml) => {
    const schemaPath = path.join(oasSchemasPath, schemaYaml)
    const parsedSchema = oasSchemaHelper.parseSchema(
      readFileSync(schemaPath, "utf-8")
    )

    if (!parsedSchema) {
      // remove file
      rmSync(schemaPath, {
        force: true,
      })
      return
    }

    // add schema to all schemas
    if (parsedSchema.schema["x-schemaName"]) {
      allSchemas.add(parsedSchema.schema["x-schemaName"])
    }

    // collect referenced schemas
    findReferencedSchemas(parsedSchema.schema)
  })

  // clean up schemas
  allSchemas.forEach((schemaName) => {
    if (referencedSchemas.has(schemaName)) {
      return
    }

    // schema isn't referenced anywhere, so remove it
    rmSync(path.join(oasSchemasPath, `${schemaName}.ts`), {
      force: true,
    })
  })

  console.log("Finished clean up")
}
