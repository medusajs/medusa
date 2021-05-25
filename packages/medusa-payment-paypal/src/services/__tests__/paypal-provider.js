import PayPalProviderService from "../paypal-provider"
import {
  PayPalMock,
  PayPalClientMock,
} from "../../__mocks__/@paypal/checkout-server-sdk"

const TotalsServiceMock = {
  getTotal: jest.fn().mockImplementation((c) => c.total),
}

const RegionServiceMock = {
  retrieve: jest.fn().mockImplementation((id) =>
    Promise.resolve({
      currency_code: "eur",
    })
  ),
}

describe("PaypalProviderService", () => {
  describe("createPayment", () => {
    let result
    const paypalProviderService = new PayPalProviderService(
      {
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("creates paypal order", async () => {
      result = await paypalProviderService.createPayment({
        id: "test_cart",
        region_id: "fr",
        total: 1000,
      })

      expect(PayPalMock.orders.OrdersCreateRequest).toHaveBeenCalledTimes(1)
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(1)
      expect(PayPalClientMock.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          order: true,
          body: {
            intent: "AUTHORIZE",
            application_context: {
              shipping_preference: "NO_SHIPPING",
            },
            purchase_units: [
              {
                custom_id: "test_cart",
                amount: {
                  currency_code: "EUR",
                  value: "10.00",
                },
              },
            ],
          },
        })
      )

      expect(result.id).toEqual("test")
    })
  })

  describe("retrievePayment", () => {
    let result
    const paypalProviderService = new PayPalProviderService(
      {
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("retrieves paypal order", async () => {
      result = await paypalProviderService.retrievePayment({ id: "test" })
      expect(PayPalMock.orders.OrdersGetRequest).toHaveBeenCalledTimes(1)
      expect(PayPalMock.orders.OrdersGetRequest).toHaveBeenCalledWith("test")
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(1)

      expect(result.id).toEqual("test")
    })
  })

  describe("updatePayment", () => {
    let result
    const paypalProviderService = new PayPalProviderService(
      {
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("updates paypal order", async () => {
      result = await paypalProviderService.updatePayment(
        { id: "test" },
        {
          id: "test_cart",
          region_id: "fr",
          total: 1000,
        }
      )

      expect(PayPalMock.orders.OrdersPatchRequest).toHaveBeenCalledTimes(1)
      expect(PayPalMock.orders.OrdersPatchRequest).toHaveBeenCalledWith("test")
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(1)
      expect(PayPalClientMock.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          order: true,
          body: [
            {
              op: "replace",
              path: "/purchase_units/@reference_id=='default'",
              value: {
                amount: {
                  currency_code: "EUR",
                  value: "10.00",
                },
              },
            },
          ],
        })
      )

      expect(result.id).toEqual("test")
    })
  })

  describe("capturePayment", () => {
    let result
    const paypalProviderService = new PayPalProviderService(
      {
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("updates paypal order", async () => {
      result = await paypalProviderService.capturePayment({
        data: {
          id: "test",
          purchase_units: [
            {
              payments: {
                authorizations: [
                  {
                    id: "test_auth",
                  },
                ],
              },
            },
          ],
        },
      })

      expect(
        PayPalMock.payments.AuthorizationsCaptureRequest
      ).toHaveBeenCalledTimes(1)
      expect(
        PayPalMock.payments.AuthorizationsCaptureRequest
      ).toHaveBeenCalledWith("test_auth")
      expect(PayPalMock.orders.OrdersGetRequest).toHaveBeenCalledWith("test")
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(2)

      expect(result.id).toEqual("test")
    })
  })

  describe("refundPayment", () => {
    let result
    const paypalProviderService = new PayPalProviderService(
      {
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("refunds payment", async () => {
      result = await paypalProviderService.refundPayment(
        {
          currency_code: "eur",
          data: {
            id: "test",
            purchase_units: [
              {
                payments: {
                  captures: [
                    {
                      id: "test_cap",
                    },
                  ],
                },
              },
            ],
          },
        },
        2000
      )

      expect(PayPalMock.payments.CapturesRefundRequest).toHaveBeenCalledWith(
        "test_cap"
      )
      expect(PayPalMock.orders.OrdersGetRequest).toHaveBeenCalledWith("test")
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(2)
      expect(PayPalClientMock.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            amount: {
              currency_code: "EUR",
              value: "20.00",
            },
          },
        })
      )

      expect(result.id).toEqual("test")
    })

    it("doesn't refund without captures", async () => {
      await expect(
        paypalProviderService.refundPayment(
          {
            currency_code: "eur",
            data: {
              id: "test",
              purchase_units: [
                {
                  payments: {
                    captures: [],
                  },
                },
              ],
            },
          },
          2000
        )
      ).rejects.toThrow("Order not yet captured")
    })
  })

  describe("cancelPayment", () => {
    let result
    const paypalProviderService = new PayPalProviderService(
      {
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("refunds if captured", async () => {
      result = await paypalProviderService.cancelPayment({
        captured_at: "true",
        currency_code: "eur",
        data: {
          id: "test",
          purchase_units: [
            {
              payments: {
                captures: [
                  {
                    id: "test_cap",
                  },
                ],
              },
            },
          ],
        },
      })

      expect(PayPalMock.payments.CapturesRefundRequest).toHaveBeenCalledWith(
        "test_cap"
      )
      expect(PayPalMock.orders.OrdersGetRequest).toHaveBeenCalledWith("test")
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(2)

      expect(result.id).toEqual("test")
    })

    it("voids if not captured", async () => {
      result = await paypalProviderService.cancelPayment({
        currency_code: "eur",
        data: {
          id: "test",
          purchase_units: [
            {
              payments: {
                authorizations: [
                  {
                    id: "test_auth",
                  },
                ],
              },
            },
          ],
        },
      })

      expect(
        PayPalMock.payments.AuthorizationsVoidRequest
      ).toHaveBeenCalledWith("test_auth")
      expect(PayPalMock.orders.OrdersGetRequest).toHaveBeenCalledWith("test")
      expect(PayPalClientMock.execute).toHaveBeenCalledTimes(2)

      expect(result.id).toEqual("test")
    })
  })
})
