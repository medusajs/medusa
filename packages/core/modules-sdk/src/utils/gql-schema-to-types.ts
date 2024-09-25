import { MedusaModule } from "../medusa-module"
import { FileSystem, toCamelCase } from "@medusajs/utils"
import { codegen } from "@graphql-codegen/core"
import { parse, printSchema, type GraphQLSchema } from "graphql"
import * as typescriptPlugin from "@graphql-codegen/typescript"

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
}: {
  outputDir: string
  filename: string
  config: Parameters<typeof codegen>[0]
}) {
  const fileSystem = new FileSystem(outputDir)

  let output = await codegen(config)
  const entryPoints = buildEntryPointsTypeMap(output)

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

export async function gqlSchemaToTypes({
  schema,
  outputDir,
  filename,
}: {
  schema: GraphQLSchema
  outputDir: string
  filename: string
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

  await generateTypes({ outputDir, filename, config })
}
