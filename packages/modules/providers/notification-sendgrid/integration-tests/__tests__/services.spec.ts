import { SendgridNotificationService } from "../../src/services/sendgrid"
jest.setTimeout(100000)

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
