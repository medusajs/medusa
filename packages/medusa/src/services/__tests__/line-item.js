import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { FlagRouter } from "../../utils/flag-router"
import LineItemService from "../line-item"
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
          withTransaction: function () {
            return this
          },
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
        }

        const pricingService = {
          withTransaction: function () {
            return this
          },
          getProductVariantPricingById: () => {
            return {
              calculated_price: 100,
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
          expect(lineItemRepository.create).toHaveBeenCalledWith({
            variant_id: IdMap.getId("test-variant"),
            cart_id: IdMap.getId("test-cart"),
            title: "Test product",
            description: "Test variant",
            thumbnail: "",
            unit_price: 100,
            quantity: 1,
          })
        })

        it("successfully create a line item with price and quantity", async () => {
          await lineItemService.create({
            variant_id: IdMap.getId("test-variant"),
            cart_id: IdMap.getId("test-cart"),
            unit_price: 50,
            quantity: 2,
          })

          expect(lineItemRepository.create).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.create).toHaveBeenCalledWith({
            variant_id: IdMap.getId("test-variant"),
            cart_id: IdMap.getId("test-cart"),
            unit_price: 50,
            quantity: 2,
          })
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
          expect(lineItemRepository.create).toHaveBeenNthCalledWith(
            2,
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
            })
          )
        })
      })

      describe("update", () => {
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

        it("successfully updates a line item with quantity", async () => {
          await lineItemService.update(IdMap.getId("test-line-item"), {
            quantity: 2,
            has_shipping: true,
          })

          expect(lineItemRepository.save).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.save).toHaveBeenCalledWith({
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
          })
        })

        it("successfully updates a line item with metadata", async () => {
          await lineItemService.update(IdMap.getId("test-line-item"), {
            metadata: {
              testKey: "testValue",
            },
          })

          expect(lineItemRepository.save).toHaveBeenCalledTimes(1)
          expect(lineItemRepository.save).toHaveBeenCalledWith({
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
          })
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
        withTransaction: function () {
          return this
        },
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
      }

      const pricingService = {
        withTransaction: function () {
          return this
        },
        getProductVariantPricingById: () => {
          return {
            calculated_price: 100,
            calculated_price_includes_tax: true,
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
          allow_discounts: undefined,
          is_giftcard: undefined,
          metadata: {},
          should_merge: true,
          includes_tax: true,
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
        withTransaction: function () {
          return this
        },
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
      }

      const pricingService = {
        withTransaction: function () {
          return this
        },
        getProductVariantPricingById: () => {
          return {
            calculated_price: 100,
            calculated_price_includes_tax: false,
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
          is_giftcard: undefined,
          metadata: {},
          should_merge: true,
          includes_tax: false,
        })
      })
    })
  })
})
