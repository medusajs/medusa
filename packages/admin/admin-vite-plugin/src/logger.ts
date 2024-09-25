import colors from "picocolors"

type LoggerOptions = {
  file?: string | string[]
  error?: any
}

function getTimestamp(): string {
  const now = new Date()
  return now.toLocaleTimeString("en-US", { hour12: true })
}

function getPrefix(type: "warn" | "info" | "error") {
  const timestamp = colors.dim(getTimestamp())
  const typeColor =
    type === "warn"
      ? colors.yellow
      : type === "info"
      ? colors.green
      : colors.red

  const prefix = typeColor("[@medusajs/admin-vite-plugin]")

  return `${timestamp} ${prefix}`
}

function getFile(options: LoggerOptions): string {
  if (!options.file) {
    return ""
  }

  const value = Array.isArray(options.file)
    ? options.file.map((f) => f).join(", ")
    : options.file

  return colors.dim(`${value}`)
}

function formatError(error: any): string {
  if (error instanceof Error) {
    return colors.red(`${error.name}: ${error.message}\n${error.stack}`)
  } else if (typeof error === "object") {
    return colors.red(JSON.stringify(error, null, 2))
  } else {
    return colors.red(String(error))
  }
}

const logger = {
  warn(msg: string, options: LoggerOptions = {}) {
    console.warn(`${getPrefix("warn")} ${msg} ${getFile(options)}`)
  },
  info(msg: string, options: LoggerOptions = {}) {
    console.info(`${getPrefix("info")} ${msg} ${getFile(options)}`)
  },
  error(msg: string, options: LoggerOptions = {}) {
    console.error(`${getPrefix("error")} ${msg} ${getFile(options)}`)
    if (options.error) {
      console.error(formatError(options.error))
    }
  },
}

export { logger }
