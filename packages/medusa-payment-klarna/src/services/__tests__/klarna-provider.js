import MockAdapter from "axios-mock-adapter"

import KlarnaProviderService from "../klarna-provider"
import { carts } from "../../__mocks__/cart"
import { TotalsServiceMock } from "../../__mocks__/totals"
import { RegionServiceMock } from "../../__mocks__/region"

describe("KlarnaProviderService", () => {
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

    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer.onPost("/checkout/v3/orders").reply(() => {
      return [200, { order_id: "123456789", order_amount: 100 }]
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates Klarna order", async () => {
      const result = await klarnaProviderService.createPayment(carts.frCart)

      // expect(mockAxios.post).toHaveBeenCalledTimes(1)
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

    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer.onGet("/checkout/v3/orders/123456789").reply(() => {
      return [200, { order_id: "123456789" }]
    })

    it("returns Klarna order", async () => {
      result = await klarnaProviderService.retrievePayment({
        order_id: "123456789",
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

    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer.onGet("/ordermanagement/v1/orders/123456789").reply(() => {
      return [200, { order_id: "123456789" }]
    })

    it("returns completed Klarna order", async () => {
      result = await klarnaProviderService.retrieveCompletedOrder("123456789")

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
    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer.onPost("/checkout/v3/orders/123456789").reply(() => {
      return [
        200,
        {
          order_id: "123456789",
          order_amount: 1000,
        },
      ]
    })

    it("returns updated Klarna order", async () => {
      result = await klarnaProviderService.updatePayment(
        {
          order_id: "123456789",
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
    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer
      .onPost("/ordermanagement/v1/orders/123456789/cancel")
      .reply(() => {
        return [200]
      })

    it("returns order id", async () => {
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
    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer
      .onPost("/ordermanagement/v1/orders/123456789/acknowledge")
      .reply(() => {
        return [200]
      })

    mockServer
      .onPatch("/ordermanagement/v1/orders/123456789/merchant-references")
      .reply(() => {
        return [200]
      })

    it("returns order id", async () => {
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
    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer
      .onPost("/ordermanagement/v1/orders/123456789/merchant-references")
      .reply(() => {
        return [200]
      })

    it("returns order id", async () => {
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
    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer.onGet("/ordermanagement/v1/orders/123456789").reply(() => {
      return [
        200,
        {
          order: { order_amount: 1000 },
        },
      ]
    })

    mockServer
      .onPost("/ordermanagement/v1/orders/123456789/captures")
      .reply(() => {
        return [200]
      })

    it("returns order id", async () => {
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
    const mockServer = new MockAdapter(klarnaProviderService.klarna_)
    mockServer
      .onPost("/ordermanagement/v1/orders/123456789/refunds")
      .reply(() => {
        return [200]
      })

    it("returns order id", async () => {
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
