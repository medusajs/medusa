const MailchimpMock = jest.fn().mockImplementation(() => {
  return {
    subscribeNewsletterAdd: jest
      .fn()
      .mockReturnValue(Promise.resolve("success")),
    subscribeNewsletterUpdate: jest
      .fn()
      .mockReturnValue(Promise.resolve("success")),
  }
})

describe("MailchimpService", () => {
  describe("newsletterSubscribe", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const mailchimpService = new MailchimpMock()

      result = await mailchimpService.subscribeNewsletterAdd(
        "medusa@medusa.com"
      )
    })

    it("resolves successfully", () => {
      expect(result).toEqual("success")
    })
  }),
    describe("newsletterSubscribeUpdate", () => {
      let result
      beforeAll(async () => {
        jest.clearAllMocks()
        const mailchimpService = new MailchimpMock()

        result = await mailchimpService.subscribeNewsletterUpdate(
          "medusa@medusa.com"
        )
      })

      it("resolves successfully", () => {
        expect(result).toEqual("success")
      })
    })
})
