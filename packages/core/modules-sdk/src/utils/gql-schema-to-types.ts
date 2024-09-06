import { codegen } from "@graphql-codegen/core"
import { FileSystem } from "@medusajs/utils"
import { parse, printSchema } from "graphql"
import { GraphQLSchema } from "graphql/type"
import { MedusaModule } from "../medusa-module"

function buildEntryPointsTypeMap(
  schema: string
): { entryPoint: string; entityType: any }[] {
  // build map entry point to there type to be merged and used by the remote query

  const joinerConfigs = MedusaModule.getAllJoinerConfigs()
  return joinerConfigs
    .flatMap((config) => {
      const aliases = Array.isArray(config.alias)
        ? config.alias
        : config.alias
        ? [config.alias]
        : []

      return aliases.flatMap((alias) => {
        const names = Array.isArray(alias.name) ? alias.name : [alias.name]
        const entity = alias.args?.["entity"]
        return names.map((aliasItem) => {
          return {
            entryPoint: aliasItem,
            entityType: entity
              ? schema.includes(`export type ${entity} `)
                ? alias.args?.["entity"]
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
  config,
}: {
  outputDir: string
  config: Parameters<typeof codegen>[0]
}) {
  const fileSystem = new FileSystem(outputDir)

  let output = await codegen(config)
  const entryPoints = buildEntryPointsTypeMap(output)

  const remoteQueryEntryPoints = `
declare module '@medusajs/types' {
  interface RemoteQueryEntryPoints {
${entryPoints
  .map((entry) => `    ${entry.entryPoint}: ${entry.entityType}`)
  .join("\n")}
  }
}`

  output += remoteQueryEntryPoints

  await fileSystem.create("remote-query-types.d.ts", output)
  await fileSystem.create(
    "index.d.ts",
    "export * as RemoteQueryTypes from './remote-query-types'"
  )
}

export async function gqlSchemaToTypes({
  schema,
  outputDir,
}: {
  schema: GraphQLSchema
  outputDir: string
}) {
  const typescriptPlugin = await import("@graphql-codegen/typescript")

  const config = {
    documents: [],
    config: {
      scalars: {
        DateTime: { output: "Date | string" },
        JSON: { output: "Record<any, unknown>" },
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

  await generateTypes({ outputDir, config })
}
