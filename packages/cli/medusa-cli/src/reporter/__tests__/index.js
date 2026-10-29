import winston from "winston"
import Transport from "winston-transport"
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
    expect(getErrorMessages(winstonMock.log)).toMatchSnapshot()
  })

  it(`handles "String, Error" signature correctly`, () => {
    reporter.error("Test log", new Error("String Error"))

    const generated = getErrorMessages(winstonMock.log)

    expect(generated).toMatchSnapshot([
      {
        stack: expect.any(Array),
      },
    ])
  })

  it(`handles "Error" signature correctly`, () => {
    reporter.error(new Error("Error"))

    const generated = getErrorMessages(winstonMock.log)

    expect(generated).toMatchSnapshot([
      {
        stack: expect.any(Array),
      },
    ])
  })

  it(`should display error cause when using json formatter`, () => {
    class MemoryTransport extends Transport {
      logs = []
      log(info, callback) {
        this.logs.push(info)
        callback()
      }
    }
    const transport = new MemoryTransport()

    const jsonReporter = new Reporter({
      logger: winston.createLogger({
        level: "info",
        levels: winston.config.npm.levels,
        format: winston.format.combine(
          winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
          }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json()
        ),
        transports: [transport],
      }),
    })
    jsonReporter.error(new Error("Error", { cause: new Error("Nested error") }))

    expect(transport.logs).toHaveLength(1)
    expect(transport.logs[0]).toHaveProperty("cause")
    expect(transport.logs[0].cause).toMatch("Nested error")
  })

  it(`should display custom message and error cause when using json formatter`, () => {
    class MemoryTransport extends Transport {
      logs = []
      log(info, callback) {
        this.logs.push(info)
        callback()
      }
    }
    const transport = new MemoryTransport()

    const jsonReporter = new Reporter({
      logger: winston.createLogger({
        level: "info",
        levels: winston.config.npm.levels,
        format: winston.format.combine(
          winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
          }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json()
        ),
        transports: [transport],
      }),
    })
    jsonReporter.error(
      "Something went wrong",
      new Error("Error", { cause: new Error("Nested error") })
    )

    expect(transport.logs).toHaveLength(1)
    expect(transport.logs[0].message).toEqual("Something went wrong: Error")
    expect(transport.logs[0]).toHaveProperty("stack")
    expect(transport.logs[0].stack).toEqual(expect.any(Array))
    expect(transport.logs[0]).toHaveProperty("cause")
    expect(transport.logs[0].cause).toMatch("Nested error")
  })
})
