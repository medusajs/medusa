import SendGridService from "../sendgrid"

describe("SendGridService", () => {
  describe("sendEmail", () => {
    let result
    const sendGridService = new SendGridService({
      api_key: "SG.1234",
      order_placed: {
        template_id: "1234",
        from: "Medusa <hello@medusa.example>",
        subject: "Medusa - Order confirmation",
      },
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("returns 202 on successful email delivery", async () => {
      result = await sendGridService.sendEmail("order.placed", {
        email: "lebron@james.com",
      })

      expect(result).toEqual(202)
    })
  })
})
