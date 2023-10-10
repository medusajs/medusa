import colors from "picocolors"

const PREFIX = colors.magenta("[toolbox]")

export const logger = {
  info: (message: string) => {
    console.log(`${PREFIX} ${colors.gray(message)}`)
  },
  success: (message: string) => {
    console.log(`${PREFIX} ${colors.green(message)}`)
  },
  warn: (message: string) => {
    console.log(`${PREFIX} ${colors.yellow(message)}`)
  },
  error: (message: string) => {
    console.log(`${PREFIX} ${colors.red(message)}`)
  },
}
