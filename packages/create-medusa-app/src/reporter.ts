import c from "ansi-colors"
import { panicHandler } from "./panic-handler"

export const reporter = {
  info: (message: string): void => console.log(message),
  verbose: (message: string): void => console.log(message),
  log: (message: string): void => console.log(message),
  success: (message: string): void =>
    console.log(c.green(c.symbols.check + ` `) + message),
  error: (message: string): void =>
    console.error(c.red(c.symbols.cross + ` `) + message),
  panic: (panicData: { id: string; context: any }): never => {
    const { message } = panicHandler(panicData)
    console.error(message)
    process.exit(1)
  },
  warn: (message: string): void => console.warn(message),
}
