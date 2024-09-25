import { FileSystem, toCamelCase } from "@medusajs/utils"
import { GraphQLSchema } from "graphql/type"
import { parse, printSchema } from "graphql"
import { codegen } from "@graphql-codegen/core"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { ModuleJoinerConfig } from "@medusajs/types"

function buildEntryPointsTypeMap({
  schema,
  joinerConfigs,
}: {
  schema: string
  joinerConfigs: ModuleJoinerConfig[]
}): { entryPoint: string; entityType: any }[] {
  // build map entry point to there type to be merged and used by the remote query

  return joinerConfigs
    .flatMap((config) => {
      const aliases = Array.isArray(config.alias)
        ? config.alias
        : config.alias
        ? [config.alias]
        : []

      return aliases.flatMap((alias) => {
        const names = Array.isArray(alias.name) ? alias.name : [alias.name]
        const entity = alias?.["entity"]
        return names.map((aliasItem) => {
          return {
            entryPoint: aliasItem,
            entityType: entity
              ? schema.includes(`export type ${entity} `)
                ? alias?.["entity"]
                : "any"
              : "any",
          }
        })
      })
    })
    .filter(Boolean)
}

async function generateTypes({
  outputDir,
  filename,
  config,
  joinerConfigs,
}: {
  outputDir: string
  filename: string
  config: Parameters<typeof codegen>[0]
  joinerConfigs: ModuleJoinerConfig[]
}) {
  const fileSystem = new FileSystem(outputDir)

  let output = await codegen(config)
  const entryPoints = buildEntryPointsTypeMap({ schema: output, joinerConfigs })

  const interfaceName = toCamelCase(filename)

  const remoteQueryEntryPoints = `
declare module '@medusajs/types' {
  interface ${interfaceName} {
${entryPoints
  .map((entry) => `    ${entry.entryPoint}: ${entry.entityType}`)
  .join("\n")}
  }
}`

  output += remoteQueryEntryPoints

  await fileSystem.create(filename + ".d.ts", output)

  const doesBarrelExists = await fileSystem.exists("index.d.ts")
  if (!doesBarrelExists) {
    await fileSystem.create(
      "index.d.ts",
      `export * as ${interfaceName}Types from './${filename}'`
    )
  } else {
    const content = await fileSystem.contents("index.d.ts")
    if (!content.includes(`${interfaceName}Types`)) {
      const newContent = `export * as ${interfaceName}Types from './${filename}'\n${content}`
      await fileSystem.create("index.d.ts", newContent)
    }
  }
}

// TODO: rename from gqlSchemaToTypes to grapthqlToTsTypes
export async function gqlSchemaToTypes({
  schema,
  outputDir,
  filename,
  joinerConfigs,
}: {
  schema: GraphQLSchema
  outputDir: string
  filename: string
  joinerConfigs: ModuleJoinerConfig[]
}) {
  const config = {
    documents: [],
    config: {
      scalars: {
        DateTime: { input: "Date | string", output: "Date | string" },
        JSON: {
          input: "Record<string, unknown>",
          output: "Record<string, unknown>",
        },
      },
    },
    filename: "",
    schema: parse(printSchema(schema as any)),
    plugins: [
      // Each plugin should be an object
      {
        typescript: {}, // Here you can pass configuration to the plugin
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
    },
  }

  await generateTypes({ outputDir, filename, config, joinerConfigs })
}
