import { parse, printSchema } from "graphql"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { codegen } from "@graphql-codegen/core"
import { logger, MedusaAppLoader } from "@medusajs/framework"
import { initializeContainer } from "@medusajs/medusa/dist/loaders"
import { FileSystem } from "@medusajs/utils"
import { MedusaModule } from "@medusajs/modules-sdk"

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

    const fileSystem = new FileSystem(directory)

    let output = await codegen(config)

    // build map entry point to there type to be merged and used by the remote query

    const joinerConfigs = MedusaModule.getAllJoinerConfigs()
    const entryPoints = joinerConfigs.flatMap((config) => {
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
              ? output.includes(`export type ${entity} `)
                ? alias.args?.["entity"]
                : "any"
              : "any",
          }
        })
      })
    })

    const remoteQueryEntryPoints = `
declare module '@medusajs/modules-sdk' {
  interface RemoteQueryEntryPoints {
    ${entryPoints
      .map((entry) => `${entry.entryPoint}: ${entry.entityType}`)
      .join("\n")}
  }
}
    `

    output += remoteQueryEntryPoints

    await fileSystem.create("src/__generated/remote-query-types.ts", output)

    const barrelExists = await fileSystem.exists("src/__generated/index.ts")

    if (!barrelExists) {
      await fileSystem.create(
        "src/__generated/index.ts",
        "export * as RemoteQueryTypes from './remote-query-types'"
      )
    }

    process.exit()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}
