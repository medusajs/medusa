import { log } from "@clack/prompts"
import chalk from "chalk"

type LogOptions = {
  message: string
  type?: "error" | "success" | "info" | "warn" | "verbose"
  stack?: string
}

export default ({ message, type = "info", stack }: LogOptions) => {
  switch (type) {
    case "info":
      log.info(message)
      break
    case "success":
      log.success(message)
      break
    case "warn":
      log.warn(message)
      break
    case "verbose":
      log.message(`${chalk.bgYellowBright("VERBOSE LOG:")} ${message}`)
      break
    case "error":
      log.error(chalk.bold.red(message.trim() + (stack || "")))
      process.exit(1)
  }
}
