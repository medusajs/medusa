import colors from "picocolors"

// type LoggerConstructorParams = {
//   context: string
//   options?: {
//     clearScreen?: boolean
//   }
// }

export class Logger {
  private readonly _prefix = "medusa-admin-cli"
  private readonly _context: string

  constructor(context: string) {
    this._context = context
  }

  public info(message: string) {}

  public success(message: string) {
    console.log(`
    [${this._prefix}]: Successfully executed the command - ${colors.bold(
      this._context
    )}
    ${colors.green("✔")} ${message}
    `)
  }

  public warn(message: string) {
    console.log(
      `[${
        this._prefix
      }]: A warning was raised while executing the command - ${colors.bold(
        this._context
      )}
      ${colors.yellow("⚠")} ${message}
      `
    )
  }

  public error(message: string) {
    console.log(`
    [${
      this._prefix
    }]: An error occurred while executing the command - ${colors.bold(
      this._context
    )}
    ${colors.red("✖")} ${message}
    `)
  }

  public prettyBuild({}) {
    const symbol = colors.cyan("➜")

    console.log(`
    ${symbol}   ${colors.bold("Build complete")}      ${colors.green("✔")}
    ${symbol}   ${colors.bold("Build directory")}     ${colors.green("build")}
    ${symbol}   ${colors.bold("Build size")}          ${colors.green("1.2MB")}
    ${symbol}   ${colors.bold("Build time")}          ${colors.green("1.2s")}
    `)
  }
}
