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

    await service.getWebhookActionAndData({
      provider: "pp_stripe",
      payload: { id: "evt_1" },
    })

    expect(
      (service as any).paymentProviderService_.getWebhookActionAndData
    ).toHaveBeenCalledWith("pp_stripe", { id: "evt_1" })
  })

  it("prefixes a bare provider id with pp_", async () => {
    const service = buildService()

    await service.getWebhookActionAndData({
      provider: "stripe",
      payload: { id: "evt_1" },
    })

    expect(
      (service as any).paymentProviderService_.getWebhookActionAndData
    ).toHaveBeenCalledWith("pp_stripe", { id: "evt_1" })
  })
})
