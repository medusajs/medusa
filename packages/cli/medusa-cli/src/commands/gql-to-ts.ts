import fs from "fs/promises"
import path from "path"
import { parse, printSchema } from "graphql"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { codegen } from "@graphql-codegen/core"
import { logger, MedusaAppLoader } from "@medusajs/framework"
import { initializeContainer } from "@medusajs/medusa/dist/loaders"

export async function graphqlToTs() {
  try {
    const directory = process.cwd()
    await initializeContainer(directory)
    const medusaAppLoader = new MedusaAppLoader()
    const { gqlSchema: schema } = await medusaAppLoader.load()

    console.log(schema)

    const outputPath = path.join(process.cwd(), "src/commands/generated.ts")

    const config = {
      documents: [],
      config: {},
      // used by a plugin internally, although the 'typescript' plugin currently
      // returns the string output, rather than writing to a file
      filename: outputPath,
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

    const output = await codegen(config)
    await fs.writeFile(outputPath, output)
    console.log("Outputs generated!")
    process.exit()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}
