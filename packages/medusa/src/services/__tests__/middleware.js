import MiddlewareService from "../middleware"

describe("MiddlewareService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("addPostAuthentication", () => {
    const middlewareService = new MiddlewareService()

    it("adds middleware function", () => {
      middlewareService.addPostAuthentication(() => "post", {})
      expect(middlewareService.postAuthentication_.length).toEqual(1)
    })

    it("fails when no function", () => {
      expect(() => middlewareService.addPostAuthentication("post", {})).toThrow(
        "Middleware must be a function"
      )
    })
  })

  describe("addPreAuthentication", () => {
    const middlewareService = new MiddlewareService()

    it("adds middleware function", () => {
      middlewareService.addPreAuthentication(() => "pre", {})
      expect(middlewareService.preAuthentication_.length).toEqual(1)
    })

    it("fails when no function", () => {
      expect(() => middlewareService.addPreAuthentication("pre", {})).toThrow(
        "Middleware must be a function"
      )
    })
  })

  describe("usePostAuthentication", () => {
    const middlewareService = new MiddlewareService()

    it("calls middleware", () => {
      // This doesn't reflect how middleware works but does suffice in our
      // testing situation
      const mid = (args) => args

      middlewareService.addPostAuthentication(mid, { data: "yes" })

      const app = {
        use: jest.fn(),
      }

      middlewareService.usePostAuthentication(app)

      expect(app.use).toHaveBeenCalledTimes(1)
      expect(app.use).toHaveBeenCalledWith({ data: "yes" })
    })
  })

  describe("usePreAuthentication", () => {
    const middlewareService = new MiddlewareService()

    it("calls middleware", () => {
      // This doesn't reflect how middleware works but does suffice in our
      // testing situation
      const mid = (args) => args

      middlewareService.addPreAuthentication(mid, { data: "yes" })

      const app = {
        use: jest.fn(),
      }

      middlewareService.usePreAuthentication(app)

      expect(app.use).toHaveBeenCalledTimes(1)
      expect(app.use).toHaveBeenCalledWith({ data: "yes" })
    })
  })
})
