import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { FlagRouter } from "../../utils/flag-router"
import LineItemService from "../line-item"
import { PricingServiceMock } from "../__mocks__/pricing"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"
import { RegionServiceMock } from "../__mocks__/region"
;[true, false].forEach((isTaxInclusiveEnabled) => {
  describe(`tax inclusive flag set to: ${isTaxInclusiveEnabled}`, () => {
    describe("LineItemService", () => {
      describe("create", () => {
        const lineItemRepository = MockRepository({
          create: (data) => data,
        })

        const cartRepository = MockRepository({
          findOne: () =>
            Promise.resolve({
              region_id: IdMap.getId("test-region"),
            }),
        })

        const regionService = {
          withTransaction: function () {
            return this
          },
          retrieve: () => {
            return {
              id: IdMap.getId("test-region"),
            }
          },
        }

        const productVariantService = {
          ...ProductVariantServiceMock,
          retrieve: (query) => {
            if (query === IdMap.getId("test-giftcard")) {
              return {
                id: IdMap.getId("test-giftcard"),
                title: "Test variant",
                product: {
                  title: "Test product",
                  thumbnail: "",
                  is_giftcard: true,
                  discountable: false,
                },
              }
            }
            return {
              id: IdMap.getId("test-variant"),
              title: "Test variant",
              product: {
                title: "Test product",
                thumbnail: "",
              },
            }
          },
          getRegionPrice: () => 100,
          list: jest.fn().mockImplementation(async (selector) => {
            return (selector.id || []).map((id) => ({
              id,
              title: "Test variant",
              product: {
                title: "Test product",
                thumbnail: "",
                discountable: false,
                is_giftcard: true,
              },
            }))
          }),
        }

        const pricingService = {
          ...PricingServiceMock,
          getProductVariantsPricing: () => {
            return {
              [IdMap.getId("test-giftcard")]: { calculated_price: 100 },
            }
          },
          getProductVariantPricing: () => {
            return {
              calculated_price: 100,
            }
          },
        }

        const featureFlagRouter = new FlagRouter({
          tax_inclusive_pricing: isTaxInclusiveEnabled,
        })

        const lineItemService = new LineItemService({
          manager: MockManager,
          pricingService,
          lineItemRepository,
          productVariantService,
          regionService,
          cartRepository,
          featureFlagRouter,
        })

        beforeEach(async () => {
          jest.clearAllMocks()
        })

        it("successfully create a line item", async () => {
          await lineItemService.create({
            variant_id: IdMap.getId("test-variant"),
            cart_id: IdMap.getId("test-cart"),
            title: "Test product",
            description: "Test variant",
            thumbnail: "",
            unit_price: 100,
            quantity: 1,
          })

          expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.create).toHaveBeenCalledWith([
            {
              variant_id: IdMap.getId("test-variant"),
              cart_id: IdMap.getId("test-cart"),
              title: "Test product",
              description: "Test variant",
              thumbnail: "",
              unit_price: 100,
              quantity: 1,
            },
          ])
        })

        it("successfully create a line item with price and quantity", async () => {
          await lineItemService.create({
            variant_id: IdMap.getId("test-variant"),
            cart_id: IdMap.getId("test-cart"),
            unit_price: 50,
            quantity: 2,
          })

          expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.create).toHaveBeenCalledWith([
            {
              variant_id: IdMap.getId("test-variant"),
              cart_id: IdMap.getId("test-cart"),
              unit_price: 50,
              quantity: 2,
            },
          ])
        })

        it("successfully create a line item giftcard", async () => {
          const line = await lineItemService.generate(
            IdMap.getId("test-giftcard"),
            IdMap.getId("test-region"),
            1
          )

          await lineItemService.create({
            ...line,
            cart_id: IdMap.getId("test-cart"),
          })

          expect(lineItemRepository.create).toHaveBeenCalledTimes(2)
          expect(lineItemRepository.create).toHaveBeenNthCalledWith(2, [
            expect.objectContaining({
              allow_discounts: false,
              variant_id: IdMap.getId("test-giftcard"),
              cart_id: IdMap.getId("test-cart"),
              title: "Test product",
              description: "Test variant",
              thumbnail: "",
              unit_price: 100,
              quantity: 1,
              is_giftcard: true,
              should_merge: true,
              metadata: {},
            }),
          ])
        })
      })

      describe("update", () => {
        const lineItemRepository = MockRepository({
          find: () =>
            Promise.resolve([
              {
                id: IdMap.getId("test-line-item"),
                variant_id: IdMap.getId("test-variant"),
                variant: {
                  id: IdMap.getId("test-variant"),
                  title: "Test variant",
                },
                cart_id: IdMap.getId("test-cart"),
                title: "Test product",
                description: "Test variant",
                thumbnail: "",
                unit_price: 50,
                quantity: 1,
              },
            ]),
        })

        const lineItemService = new LineItemService({
          manager: MockManager,
          lineItemRepository,
          productVariantService: ProductVariantServiceMock,
        })

        beforeEach(async () => {
          jest.clearAllMocks()
        })

        it("successfully updates a line item with quantity", async () => {
          await lineItemService.update(IdMap.getId("test-line-item"), {
            quantity: 2,
            has_shipping: true,
          })

          expect(lineItemRepository.save).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.save).toHaveBeenCalledWith([
            {
              id: IdMap.getId("test-line-item"),
              variant_id: IdMap.getId("test-variant"),
              variant: {
                id: IdMap.getId("test-variant"),
                title: "Test variant",
              },
              cart_id: IdMap.getId("test-cart"),
              title: "Test product",
              description: "Test variant",
              thumbnail: "",
              unit_price: 50,
              quantity: 2,
              has_shipping: true,
            },
          ])
        })

        it("successfully updates a line item with metadata", async () => {
          await lineItemService.update(IdMap.getId("test-line-item"), {
            metadata: {
              testKey: "testValue",
            },
          })

          expect(lineItemRepository.save).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.save).toHaveBeenCalledWith([
            {
              id: IdMap.getId("test-line-item"),
              variant_id: IdMap.getId("test-variant"),
              variant: {
                id: IdMap.getId("test-variant"),
                title: "Test variant",
              },
              cart_id: IdMap.getId("test-cart"),
              title: "Test product",
              description: "Test variant",
              thumbnail: "",
              unit_price: 50,
              quantity: 1,
              metadata: {
                testKey: "testValue",
              },
            },
          ])
        })
      })
      describe("delete", () => {
        const lineItemRepository = MockRepository({
          findOne: () =>
            Promise.resolve({
              id: IdMap.getId("test-line-item"),
              variant_id: IdMap.getId("test-variant"),
              variant: {
                id: IdMap.getId("test-variant"),
                title: "Test variant",
              },
              cart_id: IdMap.getId("test-cart"),
              title: "Test product",
              description: "Test variant",
              thumbnail: "",
              unit_price: 50,
              quantity: 1,
            }),
        })

        const lineItemService = new LineItemService({
          manager: MockManager,
          lineItemRepository,
        })

        beforeEach(async () => {
          jest.clearAllMocks()
        })

        it("successfully deletes", async () => {
          await lineItemService.delete(IdMap.getId("test-line-item"))

          expect(lineItemRepository.remove).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.remove).toHaveBeenCalledWith({
            id: IdMap.getId("test-line-item"),
            variant_id: IdMap.getId("test-variant"),
            variant: {
              id: IdMap.getId("test-variant"),
              title: "Test variant",
            },
            cart_id: IdMap.getId("test-cart"),
            title: "Test product",
            description: "Test variant",
            thumbnail: "",
            unit_price: 50,
            quantity: 1,
          })
        })
      })
    })
  })
})

describe("LineItemService", () => {
  describe(`tax inclusive pricing tests `, () => {
    describe("generate", () => {
      const lineItemRepository = MockRepository({
        create: (data) => data,
      })

      const cartRepository = MockRepository({
        findOne: () =>
          Promise.resolve({
            region_id: IdMap.getId("test-region"),
          }),
      })

      const regionService = {
        withTransaction: function () {
          return this
        },
        retrieve: () => {
          return {
            id: IdMap.getId("test-region"),
          }
        },
      }

      const productVariantService = {
        ...ProductVariantServiceMock,
        retrieve: (query) => {
          if (query === IdMap.getId("test-giftcard")) {
            return {
              id: IdMap.getId("test-giftcard"),
              title: "Test variant",
              product: {
                title: "Test product",
                thumbnail: "",
                is_giftcard: true,
                discountable: false,
              },
            }
          }
          return {
            id: IdMap.getId("test-variant"),
            title: "Test variant",
            product: {
              title: "Test product",
              thumbnail: "",
            },
          }
        },
        getRegionPrice: () => 100,
        list: jest.fn().mockImplementation(async (selector) => {
          return (selector.id || []).map((id) => ({
            id,
            title: "Test variant",
            product: {
              title: "Test product",
              thumbnail: "",
            },
          }))
        }),
      }

      const pricingService = {
        ...PricingServiceMock,
        getProductVariantsPricing: () => {
          return {
            [IdMap.getId("test-variant")]: {
              calculated_price: 100,
              calculated_price_includes_tax: true,
            },
          }
        },
        getProductVariantPricing: () => {
          return {
            calculated_price: 100,
            calculated_price_includes_tax: true,
          }
        },
      }

      const featureFlagRouter = new FlagRouter({
        tax_inclusive_pricing: true,
      })

      const lineItemService = new LineItemService({
        manager: MockManager,
        pricingService,
        lineItemRepository,
        productVariantService,
        regionService,
        cartRepository,
        featureFlagRouter,
      })

      beforeEach(async () => {
        jest.clearAllMocks()
      })

      it("successfully create a line item with tax inclusive set to true", async () => {
        await lineItemService.generate(
          IdMap.getId("test-variant"),
          IdMap.getId("test-region"),
          1
        )

        expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
        expect(lineItemRepository.create).toHaveBeenCalledWith({
          unit_price: 100,
          title: "Test product",
          description: "Test variant",
          thumbnail: "",
          variant_id: IdMap.getId("test-variant"),
          quantity: 1,
          order_edit_id: null,
          allow_discounts: undefined,
          is_giftcard: undefined,
          metadata: {},
          should_merge: true,
          includes_tax: true,
          variant: expect.objectContaining({
            id: expect.any(String),
            product: expect.objectContaining({
              thumbnail: "",
              title: "Test product",
            }),
            title: "Test variant",
          }),
        })
      })

      it("successfully create a line item with tax inclusive set to true by passing an object", async () => {
        await lineItemService.generate(
          {
            variantId: IdMap.getId("test-variant"),
            quantity: 1,
          },
          {
            region_id: IdMap.getId("test-region"),
          }
        )

        expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
        expect(lineItemRepository.create).toHaveBeenCalledWith({
          unit_price: 100,
          title: "Test product",
          description: "Test variant",
          thumbnail: "",
          variant_id: IdMap.getId("test-variant"),
          quantity: 1,
          allow_discounts: undefined,
          order_edit_id: null,
          is_giftcard: undefined,
          metadata: {},
          should_merge: true,
          includes_tax: true,
          variant: expect.objectContaining({
            id: expect.any(String),
            product: expect.objectContaining({
              thumbnail: "",
              title: "Test product",
            }),
            title: "Test variant",
          }),
        })
      })
    })
    describe("generate", () => {
      const lineItemRepository = MockRepository({
        create: (data) => data,
      })

      const cartRepository = MockRepository({
        findOne: () =>
          Promise.resolve({
            region_id: IdMap.getId("test-region"),
          }),
      })

      const regionService = {
        withTransaction: function () {
          return this
        },
        retrieve: () => {
          return {
            id: IdMap.getId("test-region"),
          }
        },
      }

      const productVariantService = {
        ...ProductVariantServiceMock,
        retrieve: (query) => {
          if (query === IdMap.getId("test-giftcard")) {
            return {
              id: IdMap.getId("test-giftcard"),
              title: "Test variant",
              product: {
                title: "Test product",
                thumbnail: "",
                is_giftcard: true,
                discountable: false,
              },
            }
          }
        },
        getRegionPrice: () => 100,
        list: jest.fn().mockImplementation(async (selector) => {
          return (selector.id || []).map((id) => {
            return {
              id,
              title: "Test variant",
              product: {
                title: "Test product",
                thumbnail: "",
              },
            }
          })
        }),
      }

      const pricingService = {
        ...PricingServiceMock,
        getProductVariantsPricing: () => {
          return {
            [IdMap.getId("test-variant")]: {
              calculated_price: 100,
              calculated_price_includes_tax: false,
            },
          }
        },
        getProductVariantPricing: () => {
          return {
            calculated_price: 100,
            calculated_price_includes_tax: false,
          }
        },
      }

      const featureFlagRouter = new FlagRouter({
        tax_inclusive_pricing: true,
      })

      const lineItemService = new LineItemService({
        manager: MockManager,
        pricingService,
        lineItemRepository,
        productVariantService,
        regionService,
        cartRepository,
        featureFlagRouter,
      })

      beforeEach(async () => {
        jest.clearAllMocks()
      })

      it("successfully create a line item with tax inclusive set to false", async () => {
        await lineItemService.generate(
          IdMap.getId("test-variant"),
          IdMap.getId("test-region"),
          1
        )

        expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
        expect(lineItemRepository.create).toHaveBeenCalledWith({
          unit_price: 100,
          title: "Test product",
          description: "Test variant",
          thumbnail: "",
          variant_id: IdMap.getId("test-variant"),
          quantity: 1,
          allow_discounts: undefined,
          order_edit_id: null,
          is_giftcard: undefined,
          metadata: {},
          should_merge: true,
          includes_tax: false,
          variant: expect.objectContaining({
            id: expect.any(String),
            product: expect.objectContaining({
              thumbnail: "",
              title: "Test product",
            }),
            title: "Test variant",
          }),
        })
      })

      it("successfully create a line item with tax inclusive set to false by passing an object", async () => {
        await lineItemService.generate(
          {
            variantId: IdMap.getId("test-variant"),
            quantity: 1,
          },
          {
            region_id: IdMap.getId("test-region"),
          }
        )

        expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
        expect(lineItemRepository.create).toHaveBeenCalledWith({
          unit_price: 100,
          title: "Test product",
          description: "Test variant",
          thumbnail: "",
          variant_id: IdMap.getId("test-variant"),
          quantity: 1,
          allow_discounts: undefined,
          is_giftcard: undefined,
          order_edit_id: null,
          metadata: {},
          should_merge: true,
          includes_tax: false,
          variant: expect.objectContaining({
            id: expect.any(String),
            product: expect.objectContaining({
              thumbnail: "",
              title: "Test product",
            }),
            title: "Test variant",
          }),
        })
      })
    })

    describe("clone", () => {
      const buildLineItem = (id) => ({
        id,
        original_item_id: id,
        swap_id: "test",
        order_id: "test",
        tax_lines: [
          {
            rate: 10,
            item_id: id,
          },
        ],
        adjustments: [
          {
            amount: 10,
            item_id: id,
          },
        ],
      })
      const buildExpectedLineItem = (id) =>
        expect.objectContaining({
          original_item_id: id,
          swap_id: undefined,
          claim_order_id: undefined,
          cart_id: undefined,
          order_edit_id: undefined,
          order_id: "test",
          tax_lines: expect.arrayContaining([
            expect.objectContaining({
              rate: 10,
            }),
          ]),
          adjustments: expect.arrayContaining([
            expect.objectContaining({
              amount: 10,
            }),
          ]),
        })

      const lineItemRepository = MockRepository({
        create: (data) => data,
        save: (data) => data,
        find: (selector) => {
          return selector.where.id.value.map(buildLineItem)
        },
      })

      const featureFlagRouter = new FlagRouter({})

      const lineItemService = new LineItemService({
        manager: MockManager,
        pricingService: PricingServiceMock,
        lineItemRepository,
        productVariantService: ProductVariantServiceMock,
        regionService: RegionServiceMock,
        cartRepository: MockRepository,
        featureFlagRouter,
      })

      beforeEach(async () => {
        jest.clearAllMocks()
      })

      it("successfully clone line items with tax lines and adjustments", async () => {
        const lineItemId1 = IdMap.getId("line-item-1")
        const lineItemId2 = IdMap.getId("line-item-2")

        await lineItemService.cloneTo([lineItemId1, lineItemId2], {
          order_id: "test",
        })

        expect(lineItemRepository.save).toHaveBeenCalledTimes(1)
        expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
        expect(lineItemRepository.create).toHaveBeenCalledWith(
          expect.arrayContaining([
            buildExpectedLineItem(lineItemId1),
            buildExpectedLineItem(lineItemId2),
          ])
        )
        expect(lineItemRepository.save).toHaveBeenCalledWith(
          expect.arrayContaining([
            buildExpectedLineItem(lineItemId1),
            buildExpectedLineItem(lineItemId2),
          ])
        )
      })

      it("throw on clone line items if none of the foreign keys is specified", async () => {
        const lineItemId1 = IdMap.getId("line-item-1")
        const lineItemId2 = IdMap.getId("line-item-2")

        const err = await lineItemService
          .cloneTo([lineItemId1, lineItemId2])
          .catch((e) => e)

        expect(err.message).toBe(
          "Unable to clone a line item that is not attached to at least one of: order_edit, order, swap, claim or cart."
        )
      })
    })
  })
})
