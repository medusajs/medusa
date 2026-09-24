import { MedusaError } from "@medusajs/framework/utils"

import PaymentModuleService from "../payment-module"

describe("PaymentModuleService.getWebhookActionAndData", () => {
  const buildService = () => {
    const service = Object.create(PaymentModuleService.prototype)
    service.paymentProviderService_ = {
      getWebhookActionAndData: jest.fn(
        async (providerId: string, payload: unknown) => ({
          action: "not_supported",
          data: { providerId, payload },
        })
      ),
    }
    return service as PaymentModuleService
  }

  it.each([[undefined], [null], [123], [{}]])(
    "rejects a non-string provider (%p) with a 400 instead of a TypeError",
    async (provider) => {
      const service = buildService()

      const err = await service
        .getWebhookActionAndData({ provider, payload: {} } as any)
        .catch((e) => e)

      expect(MedusaError.isMedusaError(err)).toBe(true)
      expect(err.type).toBe(MedusaError.Types.INVALID_DATA)
    }
  )

  it("passes an already-prefixed provider id through untouched", async () => {
    const service = buildService()
    const payload = { data: { id: "evt_1" }, rawData: "{}", headers: {} }

    await service.getWebhookActionAndData({
      provider: "pp_stripe",
      payload,
    })

    expect(
      (service as any).paymentProviderService_.getWebhookActionAndData
    ).toHaveBeenCalledWith("pp_stripe", payload)
  })

  it("prefixes a bare provider id with pp_", async () => {
    const service = buildService()
    const payload = { data: { id: "evt_1" }, rawData: "{}", headers: {} }

    await service.getWebhookActionAndData({
      provider: "stripe",
      payload,
    })

    expect(
      (service as any).paymentProviderService_.getWebhookActionAndData
    ).toHaveBeenCalledWith("pp_stripe", payload)
  })
})
