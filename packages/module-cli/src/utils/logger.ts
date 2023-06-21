import winston from "winston"
import chalk from "chalk"
import { program } from "commander"

const consoleTransport = new winston.transports.Console({
  format: winston.format.printf((log) => log.message),
})
const options = {
  transports: [consoleTransport],
}

export const logger = winston.createLogger(options)

export default (
  message: string,
  type?: "error" | "success" | "info" | "warning"
) => {
  type ??= "info"

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
    case "error":
      program.error(chalk.bold.red(message))
  }
}
