import { IdMap } from "medusa-test-utils"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import {
  // FulfillmentProviderServiceMock,
  DefaultProviderMock as FulfillmentProviderMock,
} from "../__mocks__/fulfillment-provider"
import SwapService from "../swap"

const generateOrder = (orderId, items, additional = {}) => {
  return {
    _id: IdMap.getId(orderId),
    items: items.map(
      ({
        id,
        product_id,
        variant_id,
        fulfilled,
        returned,
        quantity,
        price,
      }) => ({
        _id: IdMap.getId(id),
        content: {
          product: {
            _id: IdMap.getId(product_id),
          },
          variant: {
            _id: IdMap.getId(variant_id),
          },
          unit_price: price,
        },
        quantity,
        fulfilled_quantity: fulfilled || 0,
        returned_quantity: returned || 0,
      })
    ),
    ...additional,
  }
}

const testOrder = generateOrder(
  "test",
  [
    {
      id: "line",
      product_id: "product",
      variant_id: "variant",
      price: 100,
      quantity: 2,
      fulfilled: 1,
    },
  ],
  {
    currency_code: "DKK",
    region_id: IdMap.getId("region"),
    tax_rate: 0,
    shipping_address: {
      first_name: "test",
      last_name: "testson",
      address_1: "1800 test st",
      city: "testville",
      province: "test",
      country_code: "us",
      postal_code: "12345",
      phone: "+18001231234",
    },
  }
)

describe("SwapService", () => {
  describe("validateAdditionalItems_", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fails if insufficient stock", async () => {
      const swapService = new SwapService({
        productVariantService: ProductVariantServiceMock,
      })
      const res = swapService.validateAdditionalItems_([
        { variant_id: IdMap.getId("cannot-cover"), quantity: 1 },
      ])

      await expect(res).rejects.toThrow(
        "There is insufficient stock for the selected variant"
      )

      expect(ProductVariantServiceMock.canCoverQuantity).toHaveBeenCalledTimes(
        1
      )
      expect(ProductVariantServiceMock.canCoverQuantity).toHaveBeenCalledWith(
        IdMap.getId("cannot-cover"),
        1
      )
    })

    it("successfully resolves", async () => {
      const swapService = new SwapService({
        productVariantService: ProductVariantServiceMock,
      })
      const res = swapService.validateAdditionalItems_([
        { variant_id: IdMap.getId("can-cover"), quantity: 1 },
      ])

      await expect(res).resolves
      expect(ProductVariantServiceMock.canCoverQuantity).toHaveBeenCalledTimes(
        1
      )
      expect(ProductVariantServiceMock.canCoverQuantity).toHaveBeenCalledWith(
        IdMap.getId("can-cover"),
        1
      )
    })
  })

  describe("create", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const lineItemService = {
        generate: jest
          .fn()
          .mockImplementation((variantId, regionId, quantity, metadata) => {
            return {
              content: {
                unit_price: 100,
                variant: {
                  _id: variantId,
                },
                product: {
                  _id: IdMap.getId("product"),
                },
                quantity: 1,
              },
              quantity,
            }
          }),
      }
      const returnService = {
        requestReturn: jest
          .fn()
          .mockReturnValue(Promise.resolve({ test: "test" })),
      }
      const swapService = new SwapService({
        productVariantService: ProductVariantServiceMock,
        returnService,
        lineItemService,
      })

      it("calls return service requestReturn", async () => {
        await swapService.create(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          [{ variant_id: IdMap.getId("variant"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )

        expect(returnService.requestReturn).toHaveBeenCalledTimes(1)
        expect(returnService.requestReturn).toHaveBeenCalledWith(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )
      })

      it("generates lines items", async () => {
        await swapService.create(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          [{ variant_id: IdMap.getId("new-variant"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )

        expect(lineItemService.generate).toHaveBeenCalledTimes(1)
        expect(lineItemService.generate).toHaveBeenCalledWith(
          IdMap.getId("new-variant"),
          IdMap.getId("region"),
          1,
          undefined
        )
      })

      it("creates swap", async () => {
        const res = swapService.create(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          [{ variant_id: IdMap.getId("new-variant"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )

        await expect(res).resolves.toEqual({
          return: {
            test: "test",
          },
          additional_items: [
            {
              content: {
                unit_price: 100,
                variant: {
                  _id: IdMap.getId("new-variant"),
                },
                product: {
                  _id: IdMap.getId("product"),
                },
                quantity: 1,
              },
              quantity: 1,
            },
          ],
          shipping_address: {
            first_name: "test",
            last_name: "testson",
            address_1: "1800 test st",
            city: "testville",
            province: "test",
            country_code: "us",
            postal_code: "12345",
            phone: "+18001231234",
          },
        })
      })
    })
  })
})
