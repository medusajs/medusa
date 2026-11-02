import { MedusaPaymentsProvider } from "../medusa-payments"

const respondWith = (body: unknown) =>
  jest
    .spyOn(global, "fetch")
    .mockImplementation(
      async () => new Response(JSON.stringify(body), { status: 200 })
    )

const sentBody = (fetchMock: jest.SpyInstance) =>
  JSON.parse(fetchMock.mock.calls[0][1].body)

describe("MedusaPaymentsProvider", () => {
  let provider: MedusaPaymentsProvider

  beforeEach(() => {
    provider = new MedusaPaymentsProvider(
      { logger: console },
      {
        endpoint: "https://payments.test",
        webhook_secret: "whsec_test",
        api_key: "sk_test",
        payment_account: "payacc_test",
        environment_handle: "production",
        sandbox_handle: "",
      }
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("keeps the amount of the payment status in the smallest unit", async () => {
    respondWith({
      payment: {
        id: "pi_1",
        status: "requires_payment_method",
        amount: 1000,
        currency: "usd",
      },
    })

    const { data } = await provider.getPaymentStatus({ data: { id: "pi_1" } })
    expect(data).toEqual(expect.objectContaining({ amount: 1000 }))

    const retrieved = await provider.retrievePayment({ data: { id: "pi_1" } })
    expect(retrieved.data).toEqual(expect.objectContaining({ amount: 10 }))
  })

  it("throws a not found error for a deleted account holder", async () => {
    respondWith({ account_holder: null })

    await expect(
      provider.retrieveAccountHolder({ id: "cus_1" })
    ).rejects.toThrow("Account holder cus_1 was not found")
  })

  it("saves payment methods for the session's account holder", async () => {
    const fetchMock = respondWith({
      payment_method_session: { id: "seti_1" },
    })

    await provider.savePaymentMethod({
      data: { account_holder_id: "cus_other", usage: "off_session" },
      context: { account_holder: { data: { id: "cus_1" } } } as any,
    })

    expect(sentBody(fetchMock)).toEqual(
      expect.objectContaining({
        account_holder_id: "cus_1",
        usage: "off_session",
      })
    )
  })
})
