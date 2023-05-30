type ProcessOptions = {
  process: Function
  ignoreERESOLVE?: boolean
}

// when running commands with npx or npm sometimes they
// terminate with EAGAIN error unexpectedly
// this utility function allows retrying the process if
// EAGAIN occurs, or otherwise throw the error that occurs
export default async ({ process, ignoreERESOLVE }: ProcessOptions) => {
  let processError = false
  do {
    try {
      await process()
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error?.code === "EAGAIN"
      ) {
        processError = true
      } else if (
        ignoreERESOLVE &&
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error?.code === "ERESOLVE"
      ) {
        // ignore error
      } else {
        throw error
      }
    }
  } while (processError)
}
