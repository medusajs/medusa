import { gqlSchemaToTypes, logger, MedusaAppLoader } from "@medusajs/framework"
import { performance } from "node:perf_hooks"
import path from "path"
import { initializeContainer } from "../loaders"

const outputPath = "src/.medusa"

export default async function graphqlToTs() {
  let hasError = false

  try {
    const directory = process.cwd()

    await initializeContainer(directory)
    const medusaAppLoader = new MedusaAppLoader()
    const { gqlSchema: schema } = await medusaAppLoader.load()

    if (!schema) {
      logger.error("No schema found")
      process.exit()
    }

    performance.mark("[Medusa] Start generating types from GQL")

    const outputDir = path.join(directory, outputPath)
    await gqlSchemaToTypes({ outputDir, schema })

    performance.mark("[Medusa] End generating types from GQL")
  } catch (error) {
    logger.error(error)
    hasError = true
  } finally {
    const perf = performance.measure(
      "[Medusa] Generating types from GQL",
      "[Medusa] Start generating types from GQL",
      "[Medusa] End generating types from GQL"
    )
    console.log("Types generated in ", perf.duration.toFixed(2), "ms")

    process.exit(hasError ? 1 : 0)
  }
}
