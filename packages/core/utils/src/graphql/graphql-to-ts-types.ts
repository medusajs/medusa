import { codegen } from "@graphql-codegen/core"
import { type GraphQLSchema, parse, printSchema } from "graphql"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { ModuleJoinerConfig } from "@medusajs/types"
import { FileSystem } from "../common"

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
  interfaceName,
  config,
  joinerConfigs,
}: {
  outputDir: string
  filename: string
  interfaceName: string
  config: Parameters<typeof codegen>[0]
  joinerConfigs: ModuleJoinerConfig[]
}) {
  const fileSystem = new FileSystem(outputDir)

  let output = 'import "@medusajs/framework/types"\n'
  output += await codegen(config)
  const entryPoints = buildEntryPointsTypeMap({ schema: output, joinerConfigs })

  const remoteQueryEntryPoints = `
declare module '@medusajs/framework/types' {
  interface ${interfaceName} {
${entryPoints
  .map((entry) => `    ${entry.entryPoint}: ${entry.entityType}`)
  .join("\n")}
  }
}`

  output += remoteQueryEntryPoints

  const barrelFileName = "index.d.ts"
  await fileSystem.create(filename + ".d.ts", output)

  const doesBarrelExists = await fileSystem.exists(barrelFileName)
  if (!doesBarrelExists) {
    await fileSystem.create(
      barrelFileName,
      `export * as ${interfaceName}Types from './${filename}'`
    )
  } else {
    const content = await fileSystem.contents(barrelFileName)
    if (!content.includes(`${interfaceName}Types`)) {
      const newContent = `export * as ${interfaceName}Types from './${filename}'\n${content}`
      await fileSystem.create(barrelFileName, newContent)
    }
  }
}

// TODO: rename from gqlSchemaToTypes to grapthqlToTsTypes
export async function gqlSchemaToTypes({
  schema,
  outputDir,
  filename,
  joinerConfigs,
  interfaceName,
}: {
  schema: GraphQLSchema
  outputDir: string
  filename: string
  joinerConfigs: ModuleJoinerConfig[]
  interfaceName: string
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

  await generateTypes({
    outputDir,
    filename,
    config,
    joinerConfigs,
    interfaceName,
  })
}
