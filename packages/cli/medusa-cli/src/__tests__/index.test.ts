jest.mock("../create-cli", () => ({ __esModule: true, default: jest.fn() }))

type Listener = (...args: any[]) => void

describe("medusa cli process handlers", () => {
  let uncaughtException: Listener
  let unhandledRejection: Listener
  let exitSpy: jest.SpyInstance
  let logSpy: jest.SpyInstance

  beforeAll(() => {
    const before = {
      uncaughtException: process.listeners("uncaughtException"),
      unhandledRejection: process.listeners("unhandledRejection"),
    }

    jest.isolateModules(() => {
      require("../index")
    })

    uncaughtException = process
      .listeners("uncaughtException")
      .find((l) => !before.uncaughtException.includes(l)) as Listener
    unhandledRejection = process
      .listeners("unhandledRejection")
      .find((l) => !before.unhandledRejection.includes(l)) as Listener
  })

  afterAll(() => {
    process.removeListener("uncaughtException", uncaughtException)
    process.removeListener("unhandledRejection", unhandledRejection)
  })

  beforeEach(() => {
    exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as any)
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    exitSpy.mockRestore()
    logSpy.mockRestore()
  })

  const brokenPipeError = (code: string) =>
    Object.assign(new Error(`write ${code}`), { code })

  it.each(["EPIPE", "ERR_STREAM_DESTROYED"])(
    "should exit without logging on an uncaught %s error",
    (code) => {
      uncaughtException(brokenPipeError(code))

      expect(exitSpy).toHaveBeenCalledWith(1)
      expect(logSpy).not.toHaveBeenCalled()
    }
  )

  it("should exit without logging on an unhandled EPIPE rejection", () => {
    unhandledRejection(brokenPipeError("EPIPE"))

    expect(exitSpy).toHaveBeenCalledWith(1)
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("should log other uncaught errors without exiting", () => {
    const error = new Error("boom")
    uncaughtException(error)

    expect(logSpy).toHaveBeenCalledWith(error)
    expect(exitSpy).not.toHaveBeenCalled()
  })
})
