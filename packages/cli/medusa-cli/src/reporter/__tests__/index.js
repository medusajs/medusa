import { Reporter } from "../"

describe(`Reporter`, () => {
  const winstonMock = {
    log: jest.fn(),
  }

  const reporter = new Reporter({
    logger: winstonMock,
    activityLogger: {},
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

    expect(generated).toMatchSnapshot()
  })

  it(`handles "String, Error" signature correctly`, () => {
    reporter.error("Test log", new Error("String Error"))

    const generated = getErrorMessages(winstonMock.log)[0]

    expect(generated).toMatchSnapshot({
      stack: expect.any(Array),
    })
  })

  it(`handles "Error" signature correctly`, () => {
    reporter.error(new Error("Error"))

    const generated = getErrorMessages(winstonMock.log)[0]

    expect(generated).toMatchSnapshot({
      stack: expect.any(Array),
    })
  })
})
