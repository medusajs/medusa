import ora from "ora"
import colors from "picocolors"

type SpinnerContext = {
  message: string
  successMessage?: string
  errorMessage?: string
}

const PREFIX = colors.cyan("[@medusajs/admin]")

export const reporter = {
  spinner: <T>(
    promise: Promise<T>,
    { message, errorMessage, successMessage }: SpinnerContext
  ) => {
    const spinner = ora(`${PREFIX} ${colors.green(message)}`).start()
    return promise.then(
      (result) => {
        spinner.succeed(
          successMessage
            ? `${PREFIX} ${colors.green(successMessage)}`
            : undefined
        )
        return result
      },
      (error) => {
        spinner.fail(
          errorMessage ? `${PREFIX} ${colors.red(errorMessage)}` : undefined
        )
        throw error
      }
    )
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
