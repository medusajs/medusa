import { FulfillmentModuleService } from "../fulfillment-module-service"

describe("FulfillmentModuleService - Polymorphic cancel guard", () => {
  it("allows subclass override of canCancelFulfillmentOrThrow", async () => {
    class CustomFulfillmentService extends FulfillmentModuleService {
      static override canCancelFulfillmentOrThrow = jest.fn()
    }

    const mockFulfillmentService = {
      retrieve: jest.fn().mockResolvedValue({ id: "ful_123", canceled_at: new Date() }),
      update: jest.fn(),
    }

    const service = Object.create(CustomFulfillmentService.prototype)
    service.fulfillmentService_ = mockFulfillmentService
    service.fulfillmentProviderService_ = { cancelFulfillment: jest.fn() }
    service.baseRepository_ = { serialize: jest.fn().mockResolvedValue({ id: "ful_123" }) }

    await service.cancelFulfillment("ful_123")
    expect(CustomFulfillmentService.canCancelFulfillmentOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ful_123" })
    )
  })
})
