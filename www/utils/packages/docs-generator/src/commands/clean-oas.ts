import { existsSync, promises as fs } from "fs"
import { fdir } from "fdir"
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
import { getOasOutputBasePath } from "../utils/get-output-base-paths.js"
import parseOas from "../utils/parse-oas.js"

const OAS_PREFIX_REGEX = /@oas \[(?<method>(get|post|delete))\] (?<path>.+)/

const ignoreSchemas = [
  "AuthResponse",
  "AuthCallbackResponse",
  "AuthAdminSessionResponse",
  "AuthStoreSessionResponse",
]

const ignoreTags = {
  admin: ["Auth"],
  store: ["Auth"],
}

type OasFileInfo = {
  file: string
  area: OasArea
  oas: ReturnType<typeof parseOas>
  normalizedPath: string
  sourceFilePath: string
  method: string
}

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

  // Step 1: Crawl all directories in parallel
  const [operationFilesByArea, baseFiles, schemaFiles] = await Promise.all([
    Promise.all(
      areas.map(async (area) => {
        const areaPath = path.join(oasOperationsPath, area)
        if (!existsSync(areaPath)) {
          return { area, files: [] as string[] }
        }
        const files = await new fdir()
          .withFullPaths()
          .crawl(areaPath)
          .withPromise()
        return { area, files: files as string[] }
      })
    ),
    (async () => {
      const oasBasePath = path.join(oasOutputBasePath, "base")
      return (await new fdir()
        .withFullPaths()
        .crawl(oasBasePath)
        .withPromise()) as string[]
    })(),
    (async () => {
      const oasSchemasPath = path.join(oasOutputBasePath, "schemas")
      return (await new fdir()
        .withFullPaths()
        .crawl(oasSchemasPath)
        .withPromise()) as string[]
    })(),
  ])

  // Step 2: Parse all OAS files in parallel and collect valid ones
  const oasFileInfos: OasFileInfo[] = []
  const filesToDelete: string[] = []
  // Keep track of all valid OAS files for tag/schema collection (including auth files)
  const allValidOasFiles: Array<{
    file: string
    area: OasArea
    oas: ReturnType<typeof parseOas>
  }> = []

  await Promise.all(
    operationFilesByArea.flatMap(({ area, files }) =>
      files.map(async (oasFile) => {
        try {
          const content = await fs.readFile(oasFile, "utf-8")
          const parsed = parseOas(content)

          if (!parsed?.oas || !parsed.oasPrefix) {
            filesToDelete.push(oasFile)
            return
          }

          // Add to all valid OAS files for tag/schema collection
          allValidOasFiles.push({ file: oasFile, area, oas: parsed })

          const matchOasPrefix = OAS_PREFIX_REGEX.exec(parsed.oasPrefix)
          if (
            !matchOasPrefix?.groups?.method ||
            !matchOasPrefix.groups.path ||
            matchOasPrefix.groups.path.startsWith("/auth/")
          ) {
            // Skip route validation for auth files, but keep them for tag/schema collection
            return
          }

          const splitPath = matchOasPrefix.groups.path.substring(1).split("/")
          const normalizedOasPrefix = splitPath
            .map((item) => item.replace(/^\{(.+)\}$/, "[$1]"))
            .join("/")
          const sourceFilePath = path.join(
            apiRoutesPath,
            normalizedOasPrefix,
            "route.ts"
          )

          oasFileInfos.push({
            file: oasFile,
            area,
            oas: parsed,
            normalizedPath: normalizedOasPrefix,
            sourceFilePath,
            method: matchOasPrefix.groups.method.toLowerCase(),
          })
        } catch (error) {
          // If file can't be read or parsed, mark for deletion
          filesToDelete.push(oasFile)
        }
      })
    )
  )

  // Step 3: Create a single TypeScript program for all route files
  const sourceFilePaths = Array.from(
    new Set(
      oasFileInfos
        .filter((info) => !info.oas?.oas?.["x-ignoreCleanup"])
        .map((info) => info.sourceFilePath)
        .filter((filePath) => existsSync(filePath))
    )
  )

  // Create a single program and cache source files and generators
  let program: ts.Program | null = null
  let checker: ts.TypeChecker | null = null
  let oasKindGenerator: OasKindGenerator | null = null
  const sourceFileCache = new Map<string, ts.SourceFile | null>()
  const fileValidationCache = new Map<
    string,
    { sourceFile: ts.SourceFile; generator: OasKindGenerator } | null
  >()

  if (sourceFilePaths.length > 0) {
    try {
      program = ts.createProgram(sourceFilePaths, {})
      checker = program.getTypeChecker()
      oasKindGenerator = new OasKindGenerator({
        checker,
        generatorEventManager: new GeneratorEventManager(),
        additionalOptions: {},
      })

      // Cache all source files that are successfully loaded
      sourceFilePaths.forEach((filePath) => {
        const sourceFile = program!.getSourceFile(filePath) ?? null
        sourceFileCache.set(filePath, sourceFile)
        if (sourceFile && oasKindGenerator) {
          fileValidationCache.set(filePath, {
            sourceFile,
            generator: oasKindGenerator,
          })
        } else {
          fileValidationCache.set(filePath, null)
        }
      })
    } catch (error) {
      // If batch program creation fails, we'll fall back to individual programs
      console.warn(
        "Batch program creation failed, falling back to individual programs"
      )
    }
  }

  // Helper function to check if method exists in a source file
  const checkMethodExists = (
    sourceFile: ts.SourceFile,
    method: string,
    kindGenerator: OasKindGenerator
  ): boolean => {
    let exists = false
    const visitChildren = (node: ts.Node) => {
      if (
        !exists &&
        kindGenerator.isAllowed(node) &&
        kindGenerator.canDocumentNode(node) &&
        kindGenerator.getHTTPMethodName(node) === method
      ) {
        exists = true
      } else if (!exists) {
        ts.forEachChild(node, visitChildren)
      }
    }
    ts.forEachChild(sourceFile, visitChildren)
    return exists
  }

  // Step 4: Check which OAS files should be kept (parallel processing)
  const BATCH_SIZE = 100
  const validOasFiles: OasFileInfo[] = []

  for (let i = 0; i < oasFileInfos.length; i += BATCH_SIZE) {
    const batch = oasFileInfos.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async (info) => {
        const { file, oas, sourceFilePath, method } = info

        if (!oas?.oas) {
          return
        }

        if (oas.oas["x-ignoreCleanup"]) {
          validOasFiles.push(info)
          return
        }

        // Check if route file exists
        if (!existsSync(sourceFilePath)) {
          filesToDelete.push(file)
          return
        }

        // Try to use cached validation data first (fast path)
        const cached = fileValidationCache.get(sourceFilePath)
        if (cached) {
          const exists = checkMethodExists(
            cached.sourceFile,
            method,
            cached.generator
          )
          if (exists) {
            validOasFiles.push(info)
          } else {
            filesToDelete.push(file)
          }
          return
        }
      })
    )
  }

  // Step 5: Collect tags and schemas from ALL valid OAS files (parallel)
  // This includes files that passed route validation AND files that were skipped (like auth files)
  await Promise.all(
    allValidOasFiles.map(async ({ oas, area }) => {
      if (!oas?.oas) {
        return
      }

      const oasObj = oas.oas

      // collect tags
      oasObj.tags?.forEach((tag) => {
        const areaTags = tags.get(area)
        areaTags?.add(tag)
      })

      // collect schemas
      oasObj.parameters?.forEach((parameter) => {
        if (oasSchemaHelper.isRefObject(parameter)) {
          referencedSchemas.add(
            oasSchemaHelper.normalizeSchemaName(parameter.$ref)
          )
          return
        }

        if (!parameter.schema) {
          return
        }

        if (oasSchemaHelper.isRefObject(parameter.schema)) {
          referencedSchemas.add(
            oasSchemaHelper.normalizeSchemaName(parameter.schema.$ref)
          )
          return
        }

        testAndFindReferenceSchema(parameter.schema)
      })

      if (oasObj.requestBody) {
        if (oasSchemaHelper.isRefObject(oasObj.requestBody)) {
          referencedSchemas.add(
            oasSchemaHelper.normalizeSchemaName(oasObj.requestBody.$ref)
          )
        } else {
          const requestBodySchema =
            oasObj.requestBody.content[
              Object.keys(oasObj.requestBody.content)[0]
            ].schema
          if (requestBodySchema) {
            testAndFindReferenceSchema(requestBodySchema)
          }
        }
      }

      if (oasObj.responses) {
        const successResponseKey = Object.keys(oasObj.responses)[0]
        if (!Object.keys(DEFAULT_OAS_RESPONSES).includes(successResponseKey)) {
          const responseObj = oasObj.responses[successResponseKey]
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
  )

  // Step 6: Delete invalid OAS files in parallel batches
  for (let i = 0; i < filesToDelete.length; i += BATCH_SIZE) {
    const batch = filesToDelete.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async (file) => {
        await fs.unlink(file).catch(() => {})
      })
    )
  }

  console.log("Clean tags...")

  // Step 7: Process base files in parallel
  await Promise.all(
    baseFiles.map(async (baseYaml) => {
      try {
        const content = await fs.readFile(baseYaml, "utf-8")
        const parsedBaseYaml = parse(content) as OpenApiDocument

        const area = path.basename(baseYaml).split(".")[0] as OasArea
        const areaTags = tags.get(area)
        if (!areaTags) {
          return
        }
        const lengthBefore = parsedBaseYaml.tags?.length || 0

        parsedBaseYaml.tags = parsedBaseYaml.tags?.filter(
          (tag) => areaTags.has(tag.name) || ignoreTags[area].includes(tag.name)
        )

        if (lengthBefore !== (parsedBaseYaml.tags?.length || 0)) {
          // sort alphabetically
          parsedBaseYaml.tags?.sort((tagA, tagB) => {
            return tagA.name.localeCompare(tagB.name)
          })
          // write to the file
          await fs.writeFile(baseYaml, stringify(parsedBaseYaml))
        }

        // collect referenced schemas
        parsedBaseYaml.tags?.forEach((tag) => {
          if (tag["x-associatedSchema"]) {
            referencedSchemas.add(
              oasSchemaHelper.normalizeSchemaName(
                tag["x-associatedSchema"].$ref
              )
            )
          }
        })
      } catch (error) {
        // Skip files that can't be read/parsed
      }
    })
  )

  console.log("Clean schemas...")

  // Step 8: Process schema files in parallel
  const schemasToDelete: string[] = []

  await Promise.all(
    schemaFiles.map(async (schemaYaml) => {
      try {
        const content = await fs.readFile(schemaYaml, "utf-8")
        const parsedSchema = oasSchemaHelper.parseSchema(content)

        if (!parsedSchema) {
          schemasToDelete.push(schemaYaml)
          return
        }

        // add schema to all schemas
        if (parsedSchema.schema["x-schemaName"]) {
          allSchemas.add(parsedSchema.schema["x-schemaName"])
        }

        // collect referenced schemas
        findReferencedSchemas(parsedSchema.schema)
      } catch (error) {
        schemasToDelete.push(schemaYaml)
      }
    })
  )

  // Step 9: Clean up unused schemas
  const unusedSchemas = Array.from(allSchemas).filter(
    (schemaName) =>
      !referencedSchemas.has(schemaName) && !ignoreSchemas.includes(schemaName)
  )

  const oasSchemasPath = path.join(oasOutputBasePath, "schemas")
  await Promise.all(
    [
      ...schemasToDelete,
      ...unusedSchemas.map((s) => path.join(oasSchemasPath, `${s}.ts`)),
    ].map(async (filePath) => {
      await fs.unlink(filePath).catch(() => {})
    })
  )

  console.log("Finished clean up")
}
