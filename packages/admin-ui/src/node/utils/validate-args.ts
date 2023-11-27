import { CustomWebpackConfigArgs } from "../types"
import { logger } from "./logger"

function validateArgs(args: CustomWebpackConfigArgs) {
  const { options } = args

  if (options.path) {
    if (!options.path.startsWith("/")) {
      logger.panic(
        "'path' in the options of `@medusajs/admin` must start with a '/'"
      )
    }

    if (options.path !== "/" && options.path.endsWith("/")) {
      logger.panic(
        "'path' in the options of `@medusajs/admin` cannot end with a '/'"
      )
    }

    if (typeof options.path !== "string") {
      logger.panic(
        "'path' in the options of `@medusajs/admin` must be a string"
      )
    }
  }
}

export { validateArgs }
