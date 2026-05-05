import { Logger } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { initializeContainer } from "../../loaders"
import { dbCreate } from "./create"
import { migrate } from "./migrate"

const main = async function ({
  directory,
  interactive,
  db,
  skipLinks,
  skipScripts,
  executeAllLinks,
  executeSafeLinks,
}) {
  let logger: Logger | undefined

  try {
    let container = await initializeContainer(directory, {
      skipDbConnection: true,
    })
    logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    const created = await dbCreate({ directory, interactive, db, logger })
    if (!created) {
      process.exit(1)
    }

    container = await initializeContainer(directory)

    const migrated = await migrate({
      directory,
      skipLinks,
      skipScripts,
      executeAllLinks,
      executeSafeLinks,
      logger,
      container,
    })

    process.exit(migrated ? 0 : 1)
  } catch (error: any) {
    if (error.name === "ExitPromptError") {
      process.exit()
    }
    if (logger) {
      logger.error(error)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

export default main
