import sendgrid from "@sendgrid/mail"
import { SendgridNotificationService } from "../../src/services/sendgrid"

jest.mock("@sendgrid/mail", () => ({
  __esModule: true,
  default: {
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{ statusCode: 202 }, {}]),
  },
}))

jest.mock("@medusajs/framework/utils", () => ({
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
}), { virtual: true })

const mockSend = sendgrid.send as jest.MockedFunction<typeof sendgrid.send>

jest.setTimeout(100000)

describe("SendgridNotificationService - personalizations", () => {
  let service: SendgridNotificationService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new SendgridNotificationService(
      { logger: console as any },
      { api_key: "test-api-key", from: "sender@example.com" }
    )
  })

  it("passes provider_data.personalizations directly to sendgrid and omits top-level to", async () => {
    await service.send({
      to: "recipient@example.com",
      channel: "email",
      template: "some-template",
      provider_data: {
        personalizations: [
          {
            to: [{ email: "recipient@example.com" }],
            customArgs: { campaign_id: "abc123", source: "welcome-flow" },
          },
        ],
      },
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    const message = mockSend.mock.calls[0][0] as any
    expect(message).not.toHaveProperty("to")
    expect(message.personalizations).toEqual([
      {
        to: [{ email: "recipient@example.com" }],
        customArgs: { campaign_id: "abc123", source: "welcome-flow" },
      },
    ])
  })

  it("uses top-level to and omits personalizations when provider_data.personalizations is absent", async () => {
    await service.send({
      to: "recipient@example.com",
      channel: "email",
      template: "some-template",
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    const message = mockSend.mock.calls[0][0] as any
    expect(message.to).toEqual("recipient@example.com")
    expect(message).not.toHaveProperty("personalizations")
  })

  it("falls back to top-level to when provider_data.personalizations is an empty array", async () => {
    await service.send({
      to: "recipient@example.com",
      channel: "email",
      template: "some-template",
      provider_data: {
        personalizations: [],
      },
    })

    expect(mockSend).toHaveBeenCalledTimes(1)
    const message = mockSend.mock.calls[0][0] as any
    expect(message.to).toEqual("recipient@example.com")
    expect(message).not.toHaveProperty("personalizations")
  })
})

// Note: This test hits the sendgrid service, and it is mainly meant to be run manually after setting all the envvars below.
// We could also setup a sink email service to test this automatically, but it is not necessary for the time being.
describe.skip("Sendgrid notification provider", () => {
  let sendgridService: SendgridNotificationService
  let emailTemplate = ""
  let emailContent = ""
  let to = ""
  beforeAll(() => {
    sendgridService = new SendgridNotificationService(
      {
        logger: console as any,
      },
      {
        api_key: process.env.SENDGRID_TEST_API_KEY ?? "",
        from: process.env.SENDGRID_TEST_FROM ?? "",
      }
    )

    emailTemplate = process.env.SENDGRID_TEST_TEMPLATE ?? ""
    emailContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"></head><body>Welcome to medusa</body></html>`
    to = process.env.SENDGRID_TEST_TO ?? ""
  })

  it("sends an email with the specified template", async () => {
    const resp = await sendgridService.send({
      to,
      channel: "email",
      template: emailTemplate,
      data: {
        username: "john-doe",
      },
    })

    expect(resp).toEqual({})
  })

  it("sends an email with the specified email body", async () => {
    const resp = await sendgridService.send({
      to,
      channel: "email",
      template: "signup-template",
      content: {
        subject: "It's a test",
        html: emailContent,
      },
      data: {
        username: "john-doe",
      },
    })

    expect(resp).toEqual({})
  })

  it("throws an exception if the subject is not present for html content", async () => {
    const error = await sendgridService
      .send({
        to,
        template: "signup-template",
        channel: "email",
        content: { html: emailContent },
        data: {
          username: "john-doe",
        },
      })
      .catch((e) => e)

    expect(error.message).toEqual(
      "Failed to send email: 400 - The subject is required. You can get around this requirement if you use a template with a subject defined or if every personalization has a subject defined."
    )
  })

  it("throws an exception if the template does not exist", async () => {
    const error = await sendgridService
      .send({
        to,
        channel: "email",
        template: "unknown-template",
        data: {
          username: "john-doe",
        },
      })
      .catch((e) => e)

    expect(error.message).toEqual(
      "Failed to send email: 400 - The template_id must be a valid GUID, you provided 'unknown-template'."
    )
  })
  it("throws an exception if the to email is not valid", async () => {
    const error = await sendgridService
      .send({
        to: "not-email",
        channel: "email",
        template: emailTemplate,
        data: {
          username: "john-doe",
        },
      })
      .catch((e) => e)

    expect(error.message).toEqual(
      "Failed to send email: 400 - Does not contain a valid address."
    )
  })
})
