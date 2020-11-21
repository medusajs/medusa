import KlarnaProviderService from "../klarna-provider"
import mockAxios from "../../__mocks__/axios"
import { carts } from "../../__mocks__/cart"
import { TotalsServiceMock } from "../../__mocks__/totals"
import { RegionServiceMock } from "../../__mocks__/region"

describe("KlarnaProviderService", () => {
  beforeEach(() => {
    mockAxios.mockClear()
  })

  describe("createPayment", () => {
    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
        regionService: RegionServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
        merchant_urls: {
          terms: "terms",
          checkout: "checkout",
          confirmation: "confirmation",
        },
      }
    )

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates Klarna order", async () => {
      mockAxios.post = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          data: {
            order_id: "123456789",
            order_amount: 100,
          },
        })
      })

      const result = await klarnaProviderService.createPayment(carts.frCart)
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        order_id: "123456789",
        order_amount: 100,
      })
    })
  })

  describe("retrievePayment", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns Klarna order", async () => {
      mockAxios.get.mockImplementation((data) => {
        return Promise.resolve({
          data: {
            order_id: "123456789",
          },
        })
      })

      result = await klarnaProviderService.retrievePayment({
        payment_method: {
          data: {
            id: "123456789",
          },
        },
      })

      expect(result).toEqual({
        order_id: "123456789",
      })
    })
  })

  describe("retrieveCompletedOrder", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns completed Klarna order", async () => {
      mockAxios.get.mockImplementation((data) => {
        return Promise.resolve({
          order_id: "123456789",
        })
      })

      result = await klarnaProviderService.retrieveCompletedOrder({
        payment_method: {
          data: {
            id: "123456789",
          },
        },
      })

      expect(result).toEqual({
        order_id: "123456789",
      })
    })
  })

  describe("updatePayment", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
        regionService: RegionServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
        merchant_urls: {
          terms: "terms",
          checkout: "checkout",
          confirmation: "confirmation",
        },
      }
    )

    it("returns updated Klarna order", async () => {
      mockAxios.post.mockImplementation((data) => {
        return Promise.resolve({
          data: {
            order_id: "123456789",
            order_amount: 1000,
          },
        })
      })

      result = await klarnaProviderService.updatePayment(
        {
          payment_method: {
            data: {
              id: "123456789",
            },
          },
        },
        carts.frCart
      )

      expect(result).toEqual({
        order_id: "123456789",
        order_amount: 1000,
      })
    })
  })

  describe("cancelPayment", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns order id", async () => {
      mockAxios.post.mockImplementation((data) => {
        return Promise.resolve()
      })

      result = await klarnaProviderService.cancelPayment({
        order_id: "123456789",
      })

      expect(result).toEqual("123456789")
    })
  })

  describe("acknowledgeOrder", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
        regionService: RegionServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns order id", async () => {
      mockAxios.post.mockImplementation((data) => {
        return Promise.resolve({})
      })

      result = await klarnaProviderService.acknowledgeOrder("123456789")

      expect(result).toEqual("123456789")
    })
  })

  describe("addOrderToKlarnaOrder", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
        regionService: RegionServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns order id", async () => {
      mockAxios.post.mockImplementation((data) => {
        return Promise.resolve()
      })

      result = await klarnaProviderService.addOrderToKlarnaOrder(
        "123456789",
        "order123456789"
      )

      expect(result).toEqual("123456789")
    })
  })

  describe("capturePayment", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
        regionService: RegionServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns order id", async () => {
      mockAxios.get.mockImplementation((data) => {
        return Promise.resolve({
          data: {
            order: { order_amount: 1000 },
          },
        })
      })

      mockAxios.post.mockImplementation((data) => {
        return Promise.resolve()
      })

      result = await klarnaProviderService.capturePayment({
        order_id: "123456789",
      })

      expect(result).toEqual("123456789")
    })
  })

  describe("refundPayment", () => {
    let result
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const klarnaProviderService = new KlarnaProviderService(
      {
        totalsService: TotalsServiceMock,
        regionService: RegionServiceMock,
      },
      {
        url: "medusajs/tests",
        user: "lebronjames",
        password: "123456789",
      }
    )

    it("returns order id", async () => {
      mockAxios.post.mockImplementation((data) => {
        return Promise.resolve()
      })

      result = await klarnaProviderService.refundPayment(
        {
          order_id: "123456789",
        },
        1000
      )

      expect(result).toEqual("123456789")
    })
  })
})
