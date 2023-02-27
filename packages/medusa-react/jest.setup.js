const { server } = require("./mocks/server")

const originalError = console.error

beforeAll(() => {
  server.listen({
    onUnhandledRequest: (req) => {
      console.log("found an error")
      console.log(req)
    },
  })

  /**
   * We are currently using a deprecated library for testing - `@testing-library/react-hooks`.
   * This library uses `ReactDOM.render` which is deprecated in React 18. This is a temporary
   * fix to silence the warning.
   *
   * TODO: Replace the usage of `@testing-library/react-hooks` with
   * the latest `@testing-library/react` and remove this fix.
   */
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18./.test(
        args[0]
      )
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  server.resetHandlers()
  window.localStorage.clear()
})

afterAll(() => {
  server.close()
  console.error = originalError
})
