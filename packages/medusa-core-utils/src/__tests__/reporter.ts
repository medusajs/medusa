import { Reporter } from "../reporter"

describe(`Reporter`, () => {
  const winstonMock: any = {
    log: jest.fn(),
  }

  const reporter = new Reporter({
    logger: winstonMock,
    activityLogger: {} as any,
  })

  const getErrorMessages = (fn) =>
    fn.mock.calls
      .map(([firstArg]) => firstArg)
      .filter((structuredMessage) => structuredMessage.level === `error`)

  beforeEach(() => {
    winstonMock.log.mockClear()
  })

  it(`handles "String" signature correctly`, () => {
    reporter.error("Test log")

    const generated = getErrorMessages(winstonMock.log)[0]

    expect(generated).toEqual(
      expect.objectContaining({
        level: "error",
        message: "Test log",
      })
    )
  })

  it(`handles "String, Error" signature correctly`, () => {
    reporter.error("Test log", new Error("String Error"))

    const generated = getErrorMessages(winstonMock.log)[0]

    expect(generated).toEqual(
      expect.objectContaining({
        level: "error",
        message: "Test log",
        stack: expect.any(Array),
      })
    )
  })

  it(`handles "Error" signature correctly`, () => {
    reporter.error(new Error("Error"))

    const generated = getErrorMessages(winstonMock.log)[0]

    expect(generated).toEqual(
      expect.objectContaining({
        level: "error",
        message: "Error",
        stack: expect.any(Array),
      })
    )
  })
})
