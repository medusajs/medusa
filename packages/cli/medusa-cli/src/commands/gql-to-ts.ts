import { parse, printSchema } from "graphql"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { codegen } from "@graphql-codegen/core"
import { logger, MedusaAppLoader } from "@medusajs/framework"
import { initializeContainer } from "@medusajs/medusa/dist/loaders"
import { FileSystem } from "@medusajs/utils"

export async function graphqlToTs() {
  try {
    const directory = process.cwd()

    await initializeContainer(directory)
    const medusaAppLoader = new MedusaAppLoader()
    const { gqlSchema: schema } = await medusaAppLoader.load()

    const config = {
      documents: [],
      config: {},
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

    const output = await codegen(config)
    await fileSystem.create("src/__generated/remote-query-type.ts", output)

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
