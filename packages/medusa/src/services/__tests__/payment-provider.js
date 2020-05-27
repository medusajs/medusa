import { createContainer, asValue } from "awilix"
import PaymentProviderService from "../payment-provider"

describe("ProductService", () => {
  describe("retrieveProvider", () => {
    const container = createContainer()

    container.register({
      pp_default_provider: asValue("good"),
    })

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
    const createSession = jest.fn().mockReturnValue(Promise.resolve())
    const container = {
      pp_default_provider: {
        createSession,
      },
    }

    const providerService = new PaymentProviderService(container)

    it("successfully creates session", async () => {
      await providerService.createSession("default_provider", {
        total: 100,
      })

      expect(createSession).toBeCalledTimes(1)
      expect(createSession).toBeCalledWith({
        total: 100,
      })
    })
  })

  describe("updateSession", () => {
    const updateSession = jest.fn().mockReturnValue(Promise.resolve())

    const container = {
      pp_default_provider: {
        updateSession,
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

      expect(updateSession).toBeCalledTimes(1)
      expect(updateSession).toBeCalledWith(
        { id: "1234" },
        {
          total: 100,
        }
      )
    })
  })
})
