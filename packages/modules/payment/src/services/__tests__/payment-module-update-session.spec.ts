import { PaymentSessionStatus } from "@medusajs/framework/utils"
import PaymentModuleService from "../payment-module"

const baseSession = {
  id: "payses_1",
  status: PaymentSessionStatus.PENDING,
  data: { id: "pi_1", amount: 5000 },
  provider_id: "pp_stripe_stripe",
  amount: 5000,
  raw_amount: { value: "5000", precision: 20 },
  currency_code: "usd",
}

const buildService = (session: Record<string, any> = baseSession) => {
  const service: any = Object.create(PaymentModuleService.prototype)

  const updateSession = jest
    .fn()
    .mockResolvedValue({ data: { pushed: true }, status: "pending" })
  const update = jest
    .fn()
    .mockImplementation(async (data) => ({ ...session, ...data }))

  service.paymentSessionService_ = {
    retrieve: jest.fn().mockImplementation(async () => ({ ...session })),
    update,
  }
  service.paymentProviderService_ = { updateSession }
  service.baseRepository_ = {
    serialize: async (value: any) => value,
    getFreshManager: () => ({}),
    transaction: async (fn: any) => fn({}),
  }
  service.eventBusModuleService_ = { emit: jest.fn() }

  return { service, updateSession, update }
}

describe("PaymentModuleService.updatePaymentSession", () => {
  it("does not contact the provider when only the status changes", async () => {
    const { service, updateSession, update } = buildService()

    await service.updatePaymentSession({
      id: "payses_1",
      status: PaymentSessionStatus.CANCELED,
    })

    expect(updateSession).not.toHaveBeenCalled()
    expect(update).toHaveBeenCalledWith(
      { id: "payses_1", status: PaymentSessionStatus.CANCELED },
      expect.anything()
    )
  })

  it("does not contact the provider for a failed payment either", async () => {
    const { service, updateSession, update } = buildService()

    await service.updatePaymentSession({
      id: "payses_1",
      status: PaymentSessionStatus.ERROR,
    })

    expect(updateSession).not.toHaveBeenCalled()
    expect(update.mock.calls[0][0].status).toEqual(PaymentSessionStatus.ERROR)
  })

  it("leaves amount, currency and data untouched on a status-only update", async () => {
    const { service, update } = buildService()

    await service.updatePaymentSession({
      id: "payses_1",
      status: PaymentSessionStatus.CANCELED,
    })

    const payload = update.mock.calls[0][0]
    expect(payload).not.toHaveProperty("amount")
    expect(payload).not.toHaveProperty("currency_code")
    expect(payload).not.toHaveProperty("data")
  })

  it("still contacts the provider when the amount changes", async () => {
    const { service, updateSession, update } = buildService()

    await service.updatePaymentSession({
      id: "payses_1",
      amount: 7000,
      currency_code: "usd",
      data: { id: "pi_1" },
    })

    expect(updateSession).toHaveBeenCalledTimes(1)
    expect(updateSession.mock.calls[0][1]).toEqual(
      expect.objectContaining({ amount: 7000, currency_code: "usd" })
    )

    const payload = update.mock.calls[0][0]
    expect(payload.amount).toEqual(7000)
    expect(payload.data).toEqual({ pushed: true })
    expect(payload.status).toEqual("pending")
  })

  it("falls back to the session's currency and data on a partial provider update", async () => {
    const { service, updateSession } = buildService()

    await service.updatePaymentSession({ id: "payses_1", amount: 9000 })

    expect(updateSession).toHaveBeenCalledTimes(1)
    expect(updateSession.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        amount: 9000,
        currency_code: "usd",
        data: baseSession.data,
      })
    )
  })

  it("prefers a caller-provided status over the provider's", async () => {
    const { service, update } = buildService()

    await service.updatePaymentSession({
      id: "payses_1",
      amount: 7000,
      status: PaymentSessionStatus.CANCELED,
    })

    expect(update.mock.calls[0][0].status).toEqual(
      PaymentSessionStatus.CANCELED
    )
  })
})
