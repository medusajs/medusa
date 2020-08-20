import mongoose from "mongoose"
import { IdMap } from "medusa-test-utils"
import LineItemService from "../line-item"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { ProductServiceMock } from "../__mocks__/product"
import { RegionServiceMock } from "../__mocks__/region"

describe("LineItemService", () => {
  describe("generate", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const lineItemService = new LineItemService({
        productVariantService: ProductVariantServiceMock,
        productService: ProductServiceMock,
        regionService: RegionServiceMock,
      })
      result = await lineItemService.generate(
        IdMap.getId("eur-10-us-12"),
        IdMap.getId("region-france"),
        2
      )
    })

    it("generates line item and successfully defaults quantity of content to 1", () => {
      expect(result).toEqual({
        title: "test",
        description: "EUR10US-12",
        thumbnail: "test.1234",
        content: {
          unit_price: 10,
          variant: {
            _id: IdMap.getId("eur-10-us-12"),
            title: "EUR10US-12",
          },
          product: {
            _id: "1234",
            title: "test",
            thumbnail: "test.1234",
          },
          quantity: 1,
        },
        quantity: 2,
      })
    })
  })

  describe("generate with giftcard", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const lineItemService = new LineItemService({
        productVariantService: ProductVariantServiceMock,
        productService: ProductServiceMock,
        regionService: RegionServiceMock,
      })
      result = await lineItemService.generate(
        IdMap.getId("giftCardVar"),
        IdMap.getId("region-france"),
        1,
        {
          name: "Test Name",
        }
      )
    })

    it("results correctly", () => {
      expect(result).toEqual({
        title: "Gift Card",
        description: "100 USD",
        thumbnail: "1234",
        is_giftcard: true,
        content: {
          unit_price: 100,
          variant: {
            _id: IdMap.getId("giftCardVar"),
            title: "100 USD",
          },
          product: {
            _id: IdMap.getId("giftCardProd"),
            title: "Gift Card",
            thumbnail: "1234",
            is_giftcard: true,
          },
          quantity: 1,
        },
        metadata: {
          name: "Test Name",
        },
        quantity: 1,
      })
    })
  })
})
