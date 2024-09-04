import { parse, printSchema } from "graphql"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { codegen } from "@graphql-codegen/core"
import { logger, MedusaAppLoader } from "@medusajs/framework"
import { initializeContainer } from "@medusajs/medusa/dist/loaders"
import { FileSystem } from "@medusajs/utils"
import { MedusaModule } from "@medusajs/modules-sdk"
import { performance } from "node:perf_hooks"

const outputPath = "src/.medusa"

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
  directory,
  config,
}: {
  directory: string
  config: Parameters<typeof codegen>[0]
}) {
  const fileSystem = new FileSystem(directory)

  let output = await codegen(config)
  const entryPoints = buildEntryPointsTypeMap(output)

  const remoteQueryEntryPoints = `
declare module '@medusajs/types' {
  interface RemoteQueryEntryPoints {
    ${entryPoints
      .map((entry) => `${entry.entryPoint}: ${entry.entityType}`)
      .join("\n")}
  }
}
    `

  output += remoteQueryEntryPoints

  await fileSystem.create(
    outputPath + "/generated/remote-query-types.ts",
    output
  )
  await fileSystem.create(
    outputPath + "/generated/remote-query-types.d.ts",
    output
  )

  const barrelExists = await fileSystem.exists("src/generated/index.ts")

  if (!barrelExists) {
    await fileSystem.create(
      outputPath + "index.ts",
      "export * as RemoteQueryTypes from './generated/remote-query-types'"
    )
  }
}

export async function graphqlToTs() {
  try {
    const directory = process.cwd()

    await initializeContainer(directory)
    const medusaAppLoader = new MedusaAppLoader()
    const { gqlSchema: schema } = await medusaAppLoader.load()

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

    performance.mark("[Medusa] Start generating types from GQL")

    await generateTypes({ directory, config })

    performance.mark("[Medusa] End generating types from GQL")

    process.exit()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  } finally {
    const perf = performance.measure(
      "[Medusa] Generating types from GQL",
      "[Medusa] Start generating types from GQL",
      "[Medusa] End generating types from GQL"
    )
    console.log(perf)
  }
}
