import PaymentModuleService from "../../payment-module"

const mockPaymentService = {
  retrieve: jest.fn(),
  update: jest.fn(),
}

const mockPaymentProviderService = {
  cancelPayment: jest.fn(),
}

const mockRetrievePayment = jest.fn()

const fakeManager = {}
const mockBaseRepository = {
  getFreshManager: jest.fn().mockReturnValue(fakeManager),
}

function buildService() {
  const service = Object.create(PaymentModuleService.prototype)
  service.baseRepository_ = mockBaseRepository
  service.paymentService_ = mockPaymentService
  service.paymentProviderService_ = mockPaymentProviderService
  service.retrievePayment = mockRetrievePayment
  return service as PaymentModuleService
}

describe("PaymentModuleService.cancelPayment", () => {
  let service: PaymentModuleService

  beforeEach(() => {
    jest.clearAllMocks()
    service = buildService()
  })

  it("should persist the data returned by the payment provider", async () => {
    const providerData = { canceled: true, provider_cancel_id: "ext-cancel-123" }

    mockPaymentService.retrieve.mockResolvedValue({
      id: "pay-id-1",
      data: { payment_intent_id: "pi_abc" },
      provider_id: "pp_stripe",
    })
    mockPaymentProviderService.cancelPayment.mockResolvedValue({
      data: providerData,
    })
    mockPaymentService.update.mockResolvedValue(undefined)
    mockRetrievePayment.mockResolvedValue({
      id: "pay-id-1",
      data: providerData,
      canceled_at: new Date(),
    })

    const result = await service.cancelPayment("pay-id-1")

    expect(mockPaymentProviderService.cancelPayment).toHaveBeenCalledWith(
      "pp_stripe",
      expect.objectContaining({
        data: { payment_intent_id: "pi_abc" },
      })
    )

    // Only assert on the first argument (the payload) — the second is the
    // injected MedusaContext from @InjectManager(), an internal decorator concern.
    const updatePayload = mockPaymentService.update.mock.calls[0][0]
    expect(updatePayload).toEqual(
      expect.objectContaining({
        id: "pay-id-1",
        canceled_at: expect.any(Date),
        data: providerData,
      })
    )

    expect(result).toEqual(
      expect.objectContaining({
        id: "pay-id-1",
        data: providerData,
        canceled_at: expect.any(Date),
      })
    )
  })

  it("should call retrievePayment to return the final payment state", async () => {
    mockPaymentService.retrieve.mockResolvedValue({
      id: "pay-id-1",
      data: {},
      provider_id: "pp_system_default",
    })
    mockPaymentProviderService.cancelPayment.mockResolvedValue({ data: {} })
    mockPaymentService.update.mockResolvedValue(undefined)
    mockRetrievePayment.mockResolvedValue({ id: "pay-id-1" })

    await service.cancelPayment("pay-id-1")

    // Only assert on the two business arguments — the third is the injected context.
    const [paymentId, config] = mockRetrievePayment.mock.calls[0]
    expect(paymentId).toBe("pay-id-1")
    expect(config).toEqual({})
  })
})
