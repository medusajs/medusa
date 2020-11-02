const MailchimpMock = jest.fn().mockImplementation(() => {
  return {
    subscribeNewsletter: jest.fn().mockReturnValue(Promise.resolve("success")),
  }
})

describe("MailchimpService", () => {
  describe("newsletterSubscribe", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const mailchimpService = new MailchimpMock()

      result = await mailchimpService.subscribeNewsletter("medusa@medusa.com")
    })

    it("resolves successfully", () => {
      expect(result).toEqual("success")
    })
  })
})
