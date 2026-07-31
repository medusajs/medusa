import { MedusaError } from "@medusajs/framework/utils"
import PaymentProviderService from "../payment-provider"

describe("PaymentProviderService", () => {
  describe("retrieveProvider", () => {
    // The service only reaches for the provider registration and the logger,
    // so a bare container is enough to exercise the lookup.
    const buildService = (container: Record<string, unknown> = {}) => {
      container.logger = { error: jest.fn(), warn: jest.fn() }
      return new PaymentProviderService(container as any)
    }

    it("throws a NOT_FOUND MedusaError when the provider is not registered", () => {
      // Awilix containers throw on access of an unregistered key, so a
      // throwing getter reproduces what the real container does.
      const container = {}
      Object.defineProperty(container, "pp_unknown_unknown", {
        get() {
          const err = new Error("Could not resolve 'pp_unknown_unknown'.")
          err.name = "AwilixResolutionError"
          throw err
        },
      })

      const service = buildService(container)

      expect.assertions(2)

      try {
        service.retrieveProvider("pp_unknown_unknown")
      } catch (err) {
        expect(err.type).toEqual(MedusaError.Types.NOT_FOUND)
        expect(err.message).toContain("pp_unknown_unknown")
      }
    })

    it("returns the registered provider", () => {
      const provider = { getIdentifier: () => "test" }
      const service = buildService({ pp_test_test: provider })

      expect(service.retrieveProvider("pp_test_test")).toBe(provider)
    })
  })
})
