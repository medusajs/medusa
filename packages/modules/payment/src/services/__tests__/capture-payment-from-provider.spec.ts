import PaymentModuleService from "../payment-module"

describe("PaymentModuleService capturePaymentFromProvider_", () => {
  it("forwards a capture of 60 on a 100 payment to the provider", async () => {
    const capturePayment = jest.fn().mockResolvedValue({
      data: { id: "pi_123" },
    })

    const service = new PaymentModuleService(
      {
        baseRepository: {
          getFreshManager: jest.fn().mockReturnValue({}),
        },
        paymentService: {
          update: jest.fn().mockResolvedValue({}),
        },
        captureService: {},
        refundService: {},
        paymentSessionService: {},
        paymentCollectionService: {},
        accountHolderService: {},
        paymentProviderService: { capturePayment },
      } as any,
      {} as any
    )

    await (service as any).capturePaymentFromProvider_(
      {
        id: "pay_100",
        provider_id: "pp_stripe_stripe",
        data: { id: "pi_123", currency: "usd" },
        amount: 100,
      },
      {
        id: "capt_60",
        amount: 60,
        raw_amount: 60,
      },
      { isFullyCaptured: false }
    )

    expect(capturePayment).toHaveBeenCalledWith("pp_stripe_stripe", {
      data: { id: "pi_123", currency: "usd" },
      amount: 60,
      context: { idempotency_key: "capt_60" },
    })
  })
})
