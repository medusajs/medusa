import PaymentProviderService from "../payment-provider"

describe("ProductService", () => {
  describe("retrieveProvider", () => {
    const container = {
      pp_default_provider: "good",
    }

    const providerService = new PaymentProviderService(container)

    it("successfully retrieves payment provider", () => {
      const provider = providerService.retrieveProvider("default_provider")
      expect(provider).toEqual("good")
    })

    it("fails when payment provider not found", () => {
      try {
        providerService.retrieveProvider("unregistered")
      } catch (err) {
        expect(err.message).toEqual(
          "Could not find a payment provider with id: unregistered"
        )
      }
    })
  })

  describe("createSession", () => {
    const createPayment = jest.fn().mockReturnValue(Promise.resolve())
    const container = {
      pp_default_provider: {
        createPayment,
      },
    }

    const providerService = new PaymentProviderService(container)

    it("successfully creates session", async () => {
      await providerService.createSession("default_provider", {
        total: 100,
      })

      expect(createPayment).toBeCalledTimes(1)
      expect(createPayment).toBeCalledWith({
        total: 100,
      })
    })
  })

  describe("updateSession", () => {
    const updatePayment = jest.fn().mockReturnValue(Promise.resolve())

    const container = {
      pp_default_provider: {
        updatePayment,
      },
    }

    const providerService = new PaymentProviderService(container)

    it("successfully creates session", async () => {
      await providerService.updateSession(
        {
          provider_id: "default_provider",
          data: {
            id: "1234",
          },
        },
        {
          total: 100,
        }
      )

      expect(updatePayment).toBeCalledTimes(1)
      expect(updatePayment).toBeCalledWith(
        { id: "1234" },
        {
          total: 100,
        }
      )
    })
  })
})
