import colors from "picocolors"

const PREFIX = colors.cyan("[@medusajs/admin]")

export const reporter = {
  panic: (err: Error) => {
    console.error(`${PREFIX} ${colors.red(err.message)}`)
    process.exit(1)
  },
  error: (message: string) => {
    console.error(`${PREFIX} ${colors.red(message)}`)
  },
  info: (message: string) => {
    console.log(`${PREFIX} ${colors.blue(message)}`)
  },
  warn: (message: string) => {
    console.warn(`${PREFIX} ${colors.yellow(message)}`)
  },
}
