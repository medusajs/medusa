import { IdMap } from "medusa-test-utils"
import AddOnLineItemService from "../add-on-line-item"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { ProductServiceMock } from "../__mocks__/product"
import { RegionServiceMock } from "../__mocks__/region"
import { AddOnServiceMock } from "../__mocks__/add-on"

describe("LineItemService", () => {
  describe("generate", () => {
    let result

    const lineItemService = new AddOnLineItemService({
      addOnService: AddOnServiceMock,
      productVariantService: ProductVariantServiceMock,
      productService: ProductServiceMock,
      regionService: RegionServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("generates line item and successfully calculates full unit_price", async () => {
      result = await lineItemService.generate(
        IdMap.getId("test-variant-1"),
        IdMap.getId("world"),
        1,
        [IdMap.getId("test-add-on"), IdMap.getId("test-add-on-2")]
      )
      expect(result).toEqual({
        title: "Product 1",
        thumbnail: undefined,
        content: {
          unit_price: 50,
          variant: {
            _id: IdMap.getId("test-variant-1"),
            title: "variant1",
            options: [],
          },
          product: {
            _id: IdMap.getId("test-product"),
            description: "Test description",
            title: "Product 1",
            variants: [IdMap.getId("test-variant-1")],
          },
          quantity: 1,
        },
        metadata: {
          add_ons: [IdMap.getId("test-add-on"), IdMap.getId("test-add-on-2")],
        },
        quantity: 1,
      })
    })

    it("generates line item and successfully calculates full unit_price for large quantity", async () => {
      result = await lineItemService.generate(
        IdMap.getId("test-variant-1"),
        IdMap.getId("world"),
        3,
        [IdMap.getId("test-add-on"), IdMap.getId("test-add-on-2")]
      )
      expect(result).toEqual({
        title: "Product 1",
        thumbnail: undefined,
        content: {
          unit_price: 150,
          variant: {
            _id: IdMap.getId("test-variant-1"),
            title: "variant1",
            options: [],
          },
          product: {
            _id: IdMap.getId("test-product"),
            description: "Test description",
            title: "Product 1",
            variants: [IdMap.getId("test-variant-1")],
          },
          quantity: 1,
        },
        metadata: {
          add_ons: [IdMap.getId("test-add-on"), IdMap.getId("test-add-on-2")],
        },
        quantity: 3,
      })
    })

    it("fails if variant has no associated product", async () => {
      try {
        await lineItemService.generate(
          IdMap.getId("test-variant-1"),
          IdMap.getId("world"),
          1,
          [
            IdMap.getId("test-add-on"),
            IdMap.getId("test-add-on-2"),
            IdMap.getId("test-add-on-3"),
          ]
        )
      } catch (err) {
        expect(err.message).toBe(`Herbs can not be added to Product 1`)
      }
    })
  })
})
