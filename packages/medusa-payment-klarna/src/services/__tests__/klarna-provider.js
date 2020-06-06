import { IdMap } from "medusa-test-utils"
import KlarnaProviderService from "../klarna-provider"
import { CustomerServiceMock } from "../../__mocks__/customer"
import { carts } from "../../__mocks__/cart"
import { TotalsServiceMock } from "../../__mocks__/totals"

describe("KlarnaProviderService", () => {
  describe("createPayment", () => {
    let result
    const klarnaProviderService = new KlarnaProviderService(
      {
        customerService: CustomerServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("creates Klarna order", async () => {
      result = await klarnaProviderService.createPayment(carts.frCart)
      expect(result).toEqual({
        order_id: "123456789",
        order_amount: 100,
      })
    })
  })

  describe("retrievePayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const klarnaProviderService = new KlarnaProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          url: "medusajs/tests",
          user: "lebronjames",
          password: "123456789",
        }
      )

      result = await klarnaProviderService.retrievePayment({
        payment_method: {
          data: {
            id: "123456789",
          },
        },
      })
    })

    it("returns Klarna order", () => {
      expect(result).toEqual({
        order_id: "123456789",
      })
    })
  })

  describe("updatePayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const klarnaProviderService = new KlarnaProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          url: "medusajs/tests",
          user: "lebronjames",
          password: "123456789",
        }
      )

      result = await klarnaProviderService.updatePayment(
        {
          payment_method: {
            data: {
              id: "123456789",
            },
          },
        },
        {
          order_amount: 1000,
        }
      )
    })

    it("returns cancelled stripe payment intent", () => {
      expect(result).toEqual({
        order_id: "123456789",
        order_amount: 1000,
      })
    })
  })

  describe("cancelPayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const klarnaProviderService = new KlarnaProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          url: "medusajs/tests",
          user: "lebronjames",
          password: "123456789",
        }
      )

      result = await klarnaProviderService.cancelPayment({ id: "123456789" })
    })

    it("returns cancelled stripe payment intent", () => {
      expect(result).toEqual({
        order_id: "123456789",
      })
    })
  })
})
