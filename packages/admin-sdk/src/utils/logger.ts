import colors from "picocolors"

const prefix = "[@medusajs/admin-sdk]: "

export const log = {
  info: (msg: string) => {
    console.log(colors.blue(`${prefix}${msg}`))
  },
  warn: (msg: string) => {
    console.log(colors.yellow(`${prefix}${msg}`))
  },
  error: (msg: string) => {
    console.log(colors.red(`${prefix}${msg}`))
  },
}
