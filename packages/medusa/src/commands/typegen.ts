import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { initializeContainer } from "../loaders"
import { generateTypes } from "./utils/generate-types"

export default async function typegen({ directory }: { directory: string }) {
  const container = await initializeContainer(directory, {
    skipDbConnection: true,
    throwOnError: false,
  })
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    await generateTypes({
      directory,
      container,
      logger,
    })
  } catch (error) {
    logger.error("Error generating types", error)
    process.exit(1)
  }

  process.exit(0)
}
