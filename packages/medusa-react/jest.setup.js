const { server } = require("./mocks/server")

beforeAll(() => {
  server.listen({
    onUnhandledRequest: (req) => {
      console.log("found an error")
      console.log(req)
    },
  })
})

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  server.resetHandlers()
  window.localStorage.clear()
})

afterAll(() => server.close())
