import chalk from "chalk"
import { program } from "commander"
import { logger } from "./logger.js"

type LogOptions = {
  message: string
  type?: "error" | "success" | "info" | "warn" | "verbose"
  stack?: string
}

export default ({ message, type = "info", stack }: LogOptions) => {
  switch (type) {
    case "info":
      logger.info(chalk.white(message))
      break
    case "success":
      logger.info(chalk.green(message))
      break
    case "warn":
      logger.warn(chalk.yellow(message))
      break
    case "verbose":
      logger.info(`${chalk.bgYellowBright("VERBOSE LOG:")} ${message}`)
      break
    case "error":
      program.error(chalk.bold.red(message.trim() + (stack || "")))
  }
}
