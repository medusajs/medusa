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
        content: {
          unit_price: 10,
          variant: {
            _id: IdMap.getId("eur-10-us-12"),
          },
          product: {
            _id: "1234",
            title: "test",
          },
          quantity: 1,
        },
        product: {
          _id: "1234",
          title: "test",
        },
        variant: {
          _id: IdMap.getId("eur-10-us-12"),
        },
        quantity: 2,
      })
    })
  })
})
