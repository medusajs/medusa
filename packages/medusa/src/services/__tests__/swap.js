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
    fulfillment_status: "fulfilled",
    payment_status: "captured",
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

const SwapModel = ({ create, updateOne, findOne } = {}) => {
  return {
    create: jest.fn().mockImplementation((...args) => {
      if (create) {
        return create(...args)
      }
      return Promise.resolve({ data: "swap" })
    }),
    updateOne: jest.fn().mockImplementation((...args) => {
      if (updateOne) {
        return updateOne(...args)
      }
      return Promise.resolve({ data: "swap" })
    }),
    findOne: jest.fn().mockImplementation((...args) => {
      if (findOne) {
        return findOne(...args)
      }
      return Promise.resolve({ data: "swap" })
    }),
  }
}

describe("SwapService", () => {
  describe("validateReturnItems_", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fails if item is returned", async () => {
      const swapService = new SwapService({})
      const res = () =>
        swapService.validateReturnItems_(
          {
            items: [
              {
                _id: IdMap.getId("line1"),
                quantity: 1,
                returned_quantity: 1,
              },
            ],
          },
          [{ item_id: IdMap.getId("line1"), quantity: 1 }]
        )

      expect(res).toThrow("Cannot return more items than have been ordered")
    })

    it("fails if item is returned", async () => {
      const swapService = new SwapService({})
      const res = () =>
        swapService.validateReturnItems_(
          {
            items: [
              {
                _id: IdMap.getId("line1"),
                quantity: 1,
                returned_quantity: 1,
              },
            ],
          },
          [{ item_id: IdMap.getId("line2"), quantity: 1 }]
        )

      expect(res).toThrow("Item does not exist on order")
    })

    it("successfully resolves", async () => {
      const swapService = new SwapService({})
      const res = swapService.validateReturnItems_(
        {
          items: [
            {
              _id: IdMap.getId("line1"),
              quantity: 1,
              returned_quantity: 0,
            },
          ],
        },
        [{ item_id: IdMap.getId("line1"), quantity: 1 }]
      )

      expect(res).toEqual([{ item_id: IdMap.getId("line1"), quantity: 1 }])
    })
  })

  describe("createCart", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const existing = {
        _id: IdMap.getId("test-swap"),
        order_id: IdMap.getId("test"),
        return: {
          _id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        return_items: [{ item_id: IdMap.getId("line"), quantity: 1 }],
        additional_items: [{ data: "lines" }],
        other: "data",
      }

      const cartService = {
        create: jest
          .fn()
          .mockReturnValue(Promise.resolve({ _id: IdMap.getId("swap-cart") })),
      }
      const swapModel = SwapModel({ findOne: () => Promise.resolve(existing) })
      const swapService = new SwapService({
        productVariantService: ProductVariantServiceMock,
        swapModel,
        cartService,
      })

      it("finds swap and calls return create cart", async () => {
        await swapService.createCart(testOrder, IdMap.getId("swap-1"))

        expect(swapModel.findOne).toHaveBeenCalledTimes(1)
        expect(swapModel.findOne).toHaveBeenCalledWith({
          _id: IdMap.getId("swap-1"),
        })

        expect(cartService.create).toHaveBeenCalledTimes(1)
        expect(cartService.create).toHaveBeenCalledWith({
          email: testOrder.email,
          shipping_address: testOrder.shipping_address,
          billing_address: testOrder.billing_address,
          items: [
            {
              _id: IdMap.getId("line"),
              content: {
                variant: {
                  _id: IdMap.getId("variant"),
                },
                product: {
                  _id: IdMap.getId("product"),
                },
                unit_price: -100,
              },
              quantity: 1,
              fulfilled_quantity: 1,
              returned_quantity: 0,
              metadata: {
                is_return_line: true,
              },
            },
            ...existing.additional_items,
          ],
          region_id: testOrder.region_id,
          customer_id: testOrder.customer_id,
          is_swap: true,
          metadata: {
            swap_id: IdMap.getId("test-swap"),
            parent_order_id: IdMap.getId("test"),
          },
        })

        expect(swapModel.updateOne).toHaveBeenCalledTimes(1)
        expect(swapModel.updateOne).toHaveBeenCalledWith(
          { _id: IdMap.getId("swap-1") },
          { $set: { cart_id: IdMap.getId("swap-cart") } }
        )
      })
    })

    describe("failure", () => {
      const existing = {
        return: {
          _id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        additional_items: [{ data: "lines" }],
        other: "data",
      }

      it("fails if swap doesn't belong to order", async () => {
        const swapModel = SwapModel({
          findOne: () => Promise.resolve(existing),
        })
        const swapService = new SwapService({ swapModel })
        const res = swapService.createCart(testOrder, IdMap.getId("swap-1"))

        await expect(res).rejects.toThrow(
          "The swap does not belong to the order"
        )
      })

      it("fails if cart already created", async () => {
        const swapModel = SwapModel({
          findOne: () =>
            Promise.resolve({
              ...existing,
              order_id: IdMap.getId("test"),
              cart_id: IdMap.getId("swap-cart"),
            }),
        })
        const swapService = new SwapService({ swapModel })
        const res = swapService.createCart(testOrder, IdMap.getId("swap-1"))

        await expect(res).rejects.toThrow(
          "A cart has already been created for the swap"
        )
      })
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
      const swapModel = SwapModel()
      const swapService = new SwapService({
        swapModel,
        productVariantService: ProductVariantServiceMock,
        lineItemService,
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
          1
        )
      })

      it("creates swap", async () => {
        await swapService.create(
          testOrder,
          [{ item_id: IdMap.getId("line"), quantity: 1 }],
          [{ variant_id: IdMap.getId("new-variant"), quantity: 1 }],
          {
            id: IdMap.getId("return-shipping"),
            price: 20,
          }
        )

        expect(swapModel.create).toHaveBeenCalledWith({
          order_id: IdMap.getId("test"),
          return_items: [{ item_id: IdMap.getId("line"), quantity: 1 }],
          region_id: IdMap.getId("region"),
          currency_code: "DKK",
          return_shipping: {
            id: IdMap.getId("return-shipping"),
            price: 20,
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
        })
      })
    })
  })

  describe("receiveReturn", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const returnService = {
        receiveReturn: jest
          .fn()
          .mockReturnValue(Promise.resolve({ test: "received" })),
      }

      const existing = {
        order_id: IdMap.getId("test"),
        return: {
          _id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        other: "data",
      }

      const swapModel = SwapModel({ findOne: () => Promise.resolve(existing) })
      const swapService = new SwapService({ swapModel, returnService })

      it("calls register return and updates return value", async () => {
        await swapService.receiveReturn(testOrder, IdMap.getId("swap"), [
          { variant_id: IdMap.getId("1234"), quantity: 1 },
        ])

        expect(swapModel.updateOne).toHaveBeenCalledWith(
          { _id: IdMap.getId("swap") },
          {
            $set: {
              status: "received",
              return: { test: "received" },
            },
          }
        )

        expect(returnService.receiveReturn).toHaveBeenCalledTimes(1)
        expect(returnService.receiveReturn).toHaveBeenCalledWith(
          testOrder,
          existing.return,
          [{ variant_id: IdMap.getId("1234"), quantity: 1 }],
          11,
          false
        )
      })
    })

    describe("failure", () => {
      const returnService = {
        receiveReturn: jest
          .fn()
          .mockReturnValue(Promise.resolve({ status: "requires_action" })),
      }

      const existing = {
        order_id: IdMap.getId("test"),
        return: {
          _id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        other: "data",
      }

      const swapModel = SwapModel({
        findOne: t =>
          Promise.resolve(t._id.equals(IdMap.getId("empty")) ? {} : existing),
      })
      const swapService = new SwapService({ swapModel, returnService })

      it("fails if swap has no return request", async () => {
        const res = swapService.receiveReturn(
          testOrder,
          IdMap.getId("empty"),
          []
        )
        await expect(res).rejects.toThrow("Swap has no return request")
      })

      it("sets requires action if return fails", async () => {
        await swapService.receiveReturn(testOrder, IdMap.getId("swap"), [
          { variant_id: IdMap.getId("1234"), quantity: 1 },
        ])

        expect(swapModel.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("swap"),
          },
          {
            $set: {
              status: "requires_action",
              return: { status: "requires_action" },
            },
          }
        )

        expect(returnService.receiveReturn).toHaveBeenCalledTimes(1)
        expect(returnService.receiveReturn).toHaveBeenCalledWith(
          testOrder,
          existing.return,
          [{ variant_id: IdMap.getId("1234"), quantity: 1 }],
          11,
          false
        )
      })
    })
  })

  describe("createFulfillment", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const fulfillmentService = {
        createFulfillment: jest
          .fn()
          .mockReturnValue(Promise.resolve([{ data: "new" }])),
      }

      const existing = {
        additional_items: [
          {
            _id: IdMap.getId("1234"),
            quantity: 2,
          },
        ],
        shipping_methods: [{ method: "1" }],
        return: {
          _id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        other: "data",
      }

      const swapModel = SwapModel({ findOne: () => existing })
      const swapService = new SwapService({ swapModel, fulfillmentService })

      it("creates a fulfillment", async () => {
        await swapService.createFulfillment(testOrder, IdMap.getId("swap"))

        expect(swapModel.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("swap"),
          },
          {
            $set: {
              fulfillment_status: "fulfilled",
              fulfillments: [{ data: "new" }],
            },
          }
        )

        expect(fulfillmentService.createFulfillment).toHaveBeenCalledWith(
          {
            ...existing,
            currency_code: testOrder.currency_code,
            tax_rate: testOrder.tax_rate,
            region_id: testOrder.region_id,
            display_id: testOrder.display_id,
            is_swap: true,
            billing_address: testOrder.billing_address,
            items: existing.additional_items,
            shipping_methods: existing.shipping_methods,
          },
          [{ item_id: IdMap.getId("1234"), quantity: 2 }],
          {}
        )
      })
    })

    describe("failure", () => {})
  })

  describe("createShipment", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const fulfillmentService = {
        createShipment: jest.fn().mockImplementation((o, f) => {
          return Promise.resolve({ ...f, data: "new" })
        }),
      }

      const eventBusService = {
        emit: jest.fn().mockReturnValue(Promise.resolve()),
      }

      const existing = {
        additional_items: [
          {
            _id: IdMap.getId("1234-1"),
            quantity: 2,
            shipped_quantity: 0,
          },
        ],
        fulfillments: [
          {
            _id: IdMap.getId("f1"),
            items: [
              {
                _id: IdMap.getId("1234-1"),
                item_id: IdMap.getId("1234-1"),
                quantity: 2,
              },
            ],
          },
          {
            _id: IdMap.getId("f2"),
            items: [
              {
                _id: IdMap.getId("1234-2"),
                item_id: IdMap.getId("1234-2"),
                quantity: 2,
              },
            ],
          },
        ],
        shipping_methods: [{ method: "1" }],
        return: {
          _id: IdMap.getId("return-swap"),
          test: "notreceived",
          refund_amount: 11,
        },
        other: "data",
      }
      const swapModel = SwapModel({
        updateOne: () => Promise.resolve(existing),
        findOne: () => existing,
      })
      const swapService = new SwapService({
        swapModel,
        eventBusService,
        fulfillmentService,
      })

      it("creates a shipment", async () => {
        await swapService.createShipment(
          IdMap.getId("swap"),
          IdMap.getId("f1"),
          ["1234"],
          {}
        )

        expect(swapModel.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("swap"),
          },
          {
            $set: {
              additional_items: [
                {
                  _id: IdMap.getId("1234-1"),
                  quantity: 2,
                  shipped: true,
                  shipped_quantity: 2,
                },
              ],
              fulfillment_status: "shipped",
              fulfillments: [
                {
                  _id: IdMap.getId("f1"),
                  items: [
                    {
                      _id: IdMap.getId("1234-1"),
                      item_id: IdMap.getId("1234-1"),
                      quantity: 2,
                    },
                  ],
                  data: "new",
                },
                {
                  _id: IdMap.getId("f2"),
                  items: [
                    {
                      _id: IdMap.getId("1234-2"),
                      item_id: IdMap.getId("1234-2"),
                      quantity: 2,
                    },
                  ],
                },
              ],
            },
          }
        )

        expect(fulfillmentService.createShipment).toHaveBeenCalledWith(
          {
            items: existing.additional_items,
            shipping_methods: existing.shipping_methods,
          },
          {
            _id: IdMap.getId("f1"),
            items: [
              {
                _id: IdMap.getId("1234-1"),
                item_id: IdMap.getId("1234-1"),
                quantity: 2,
              },
            ],
          },
          ["1234"],
          {}
        )
      })
    })

    describe("failure", () => {})
  })

  describe("requestReturn", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("success", () => {
      const existing = {
        return_items: [{ data: "returnline" }],
        return_shipping: { shipping: "return" },
      }

      const returnService = {
        requestReturn: jest
          .fn()
          .mockReturnValue(Promise.resolve({ return: "data" })),
      }
      const swapModel = SwapModel({ findOne: () => existing })
      const swapService = new SwapService({
        swapModel,
        returnService,
      })

      it("calls requestReturn and updates", async () => {
        await swapService.requestReturn(testOrder, IdMap.getId("swap"))

        expect(returnService.requestReturn).toHaveBeenCalledTimes(1)
        expect(returnService.requestReturn).toHaveBeenCalledWith(
          testOrder,
          existing.return_items,
          existing.return_shipping
        )

        expect(swapModel.updateOne).toHaveBeenCalledWith(
          {
            _id: IdMap.getId("swap"),
          },
          { $set: { return: { return: "data" } } }
        )
      })
    })
  })
})
