import chalk from "chalk"
import { program } from "commander"
import { logger } from "./logger.js"

type LogOptions = {
  message: string
  type?: "error" | "success" | "info" | "warning" | "verbose"
}

export default ({ message, type = "info" }: LogOptions) => {
  switch (type) {
    case "info":
      logger.info(chalk.white(message))
      break
    case "success":
      logger.info(chalk.green(message))
      break
    case "warning":
      logger.warning(chalk.yellow(message))
      break
    case "verbose":
      logger.info(`${chalk.bgYellowBright("VERBOSE LOG:")} ${message}`)
      break
    case "error":
      program.error(chalk.bold.red(message))
  }
}
