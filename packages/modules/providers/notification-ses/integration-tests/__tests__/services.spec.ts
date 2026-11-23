import { SesNotificationService } from "../../src/services/ses"

jest.mock("@aws-sdk/client-sesv2", () => ({
  __esModule: true,
  SESv2Client: class {
    send = jest.fn()
  },
  SendEmailCommand: class {
    input: Record<string, unknown>
    constructor(input: Record<string, unknown>) {
      this.input = input
    }
  },
}))

jest.mock(
  "@medusajs/framework/utils",
  () => ({
    AbstractNotificationProviderService: class {},
    MedusaError: class MedusaError extends Error {
      static Types = {
        INVALID_DATA: "invalid_data",
        UNEXPECTED_STATE: "unexpected_state",
      }
      type: string
      constructor(type: string, message: string) {
        super(message)
        this.type = type
      }
    },
  }),
  { virtual: true }
)

jest.setTimeout(100000)

describe("SesNotificationService", () => {
  let service: SesNotificationService
  let mockSend: jest.Mock

  const createService = (options = {}) =>
    new SesNotificationService(
      { logger: console as any },
      {
        from: "sender@example.com",
        region: "us-east-1",
        configuration_set_name: "transactional",
        reply_to_addresses: ["support@example.com"],
        ...options,
      }
    )

  const sentCommand = (callIndex = 0) =>
    mockSend.mock.calls[callIndex][0].input as Record<string, any>

  beforeEach(() => {
    service = createService()
    mockSend = (service as any).client_.send
    mockSend.mockResolvedValue({ MessageId: "message-id" })
  })

  describe("templates", () => {
    it("sends the notification template with the notification data", async () => {
      const result = await service.send({
        to: "recipient@example.com",
        channel: "email",
        template: "order-confirmation",
        data: { display_id: 1042 },
      })

      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ id: "message-id" })

      const command = sentCommand()
      expect(command.FromEmailAddress).toEqual("sender@example.com")
      expect(command.Destination).toEqual({
        ToAddresses: ["recipient@example.com"],
      })
      expect(command.Content).toEqual({
        Template: {
          TemplateName: "order-confirmation",
          TemplateData: JSON.stringify({ display_id: 1042 }),
        },
      })
      expect(command.ConfigurationSetName).toEqual("transactional")
      expect(command.ReplyToAddresses).toEqual(["support@example.com"])
    })

    it("defaults the template data to an empty object", async () => {
      await service.send({
        to: "recipient@example.com",
        channel: "email",
        template: "order-confirmation",
      })

      expect(sentCommand().Content.Template.TemplateData).toEqual("{}")
    })
  })

  describe("content", () => {
    it("sends the notification content as simple email content", async () => {
      await service.send({
        to: "recipient@example.com",
        channel: "email",
        template: "ignored-when-content-is-set",
        content: {
          subject: "Your order",
          html: "<p>Thanks</p>",
          text: "Thanks",
        },
      })

      expect(sentCommand().Content).toEqual({
        Simple: {
          Subject: { Data: "Your order", Charset: "UTF-8" },
          Body: {
            Html: { Data: "<p>Thanks</p>", Charset: "UTF-8" },
            Text: { Data: "Thanks", Charset: "UTF-8" },
          },
        },
      })
    })

    it("omits the body parts that aren't set", async () => {
      await service.send({
        to: "recipient@example.com",
        channel: "email",
        template: "",
        content: { subject: "Your order", html: "<p>Thanks</p>" },
      })

      expect(sentCommand().Content.Simple.Body).toEqual({
        Html: { Data: "<p>Thanks</p>", Charset: "UTF-8" },
      })
    })

    it("throws when the content has no subject", async () => {
      const error = await service
        .send({
          to: "recipient@example.com",
          channel: "email",
          template: "",
          content: { html: "<p>Thanks</p>" },
        })
        .catch((e) => e)

      expect(error.type).toEqual("invalid_data")
      expect(error.message).toEqual(
        "The notification content requires a subject"
      )
      expect(mockSend).not.toHaveBeenCalled()
    })
  })

  describe("addresses", () => {
    it("prefers the notification's from address", async () => {
      await service.send({
        to: "recipient@example.com",
        channel: "email",
        template: "order-confirmation",
        from: "billing@example.com",
      })

      expect(sentCommand().FromEmailAddress).toEqual("billing@example.com")
    })

    it("passes cc and bcc addresses from provider_data", async () => {
      await service.send({
        to: "recipient@example.com",
        channel: "email",
        template: "order-confirmation",
        provider_data: {
          cc: ["cc@example.com"],
          bcc: ["bcc@example.com"],
        },
      })

      expect(sentCommand().Destination).toEqual({
        ToAddresses: ["recipient@example.com"],
        CcAddresses: ["cc@example.com"],
        BccAddresses: ["bcc@example.com"],
      })
    })
  })

  it("throws when attachments are passed", async () => {
    const error = await service
      .send({
        to: "recipient@example.com",
        channel: "email",
        template: "order-confirmation",
        attachments: [{ content: "Zm9v", filename: "invoice.pdf" }],
      })
      .catch((e) => e)

    expect(error.type).toEqual("invalid_data")
    expect(error.message).toEqual(
      "The SES notification provider doesn't support attachments"
    )
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("wraps AWS errors as unexpected state errors", async () => {
    mockSend.mockRejectedValue(
      new Error("Email address is not verified. The following identities failed the check in region US-EAST-1: sender@example.com")
    )

    const error = await service
      .send({
        to: "recipient@example.com",
        channel: "email",
        template: "order-confirmation",
      })
      .catch((e) => e)

    expect(error.type).toEqual("unexpected_state")
    expect(error.message).toEqual(
      "Failed to send email: Error - Email address is not verified. The following identities failed the check in region US-EAST-1: sender@example.com"
    )
  })
})
