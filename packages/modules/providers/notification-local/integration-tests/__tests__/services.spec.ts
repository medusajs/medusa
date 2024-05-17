import { LocalNotificationService } from "../../src/services/local"
jest.setTimeout(100000)

describe("Local notification provider", () => {
  let localService: LocalNotificationService

  beforeAll(() => {
    localService = new LocalNotificationService(
      {
        logger: console as any,
      },
      {}
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("sends logs to the console output with the notification details", async () => {
    const logSpy = jest.spyOn(console, "info")
    await localService.send({
      to: "test@medusajs.com",
      channel: "email",
      template: "some-template",
      data: {
        username: "john-doe",
      },
    })

    expect(logSpy).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(
      `Attempting to send a notification to: 'test@medusajs.com' on the channel: 'email' with template: 'some-template' and data: '{\"username\":\"john-doe\"}'`
    )
  })
})
