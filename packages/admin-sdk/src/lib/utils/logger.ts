import readline from "node:readline"
import colors from "picocolors"
import type { RollupError } from "rollup"

const prefix = "[@medusajs/admin-sdk]"

type LogType = "error" | "warn" | "info"

interface LogOptions {
  clearScreen?: boolean
}

interface LogErrorOptions extends LogOptions {
  error?: Error | RollupError | null
}

interface Logger {
  info(msg: string, options?: LogOptions): void
  warn(msg: string, options?: LogOptions): void
  error(msg: string, options?: LogErrorOptions): void
}

function clearScreen() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : ""
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

const canClearScreen = process.stdout.isTTY && !process.env.CI
const clear = canClearScreen ? clearScreen : () => {}

export function createLogger(): Logger {
  const output = (type: LogType, msg: string, options?: LogErrorOptions) => {
    const method = type === "info" ? "log" : type
    const format = () => {
      const tag =
        type === "info"
          ? colors.cyan(colors.bold(prefix))
          : type === "warn"
          ? colors.yellow(colors.bold(prefix))
          : colors.red(colors.bold(prefix))
      return `${colors.dim(new Date().toLocaleTimeString())} ${tag} ${msg}`
    }

    if (options?.clearScreen) {
      clear()
    }

    console[method](format())
  }

  return {
    info: (msg, options) => output("info", msg, options),
    warn: (msg, options) => output("warn", msg, options),
    error: (msg, options) => output("error", msg, options),
  }
}
