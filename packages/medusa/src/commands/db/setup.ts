import { logger } from "@medusajs/framework/logger"
import { dbCreate } from "./create"
import { migrate } from "./migrate"

const main = async function ({
  directory,
  interactive,
  db,
  skipLinks,
  executeAllLinks,
  executeSafeLinks,
}) {
  try {
    const created = await dbCreate({ directory, interactive, db })
    if (!created) {
      process.exit(1)
    }

    const migrated = await migrate({
      directory,
      skipLinks,
      executeAllLinks,
      executeSafeLinks,
    })

    process.exit(migrated ? 0 : 1)
  } catch (error) {
    if (error.name === "ExitPromptError") {
      process.exit()
    }
    logger.error(error)
    process.exit(1)
  }
}

export default main
