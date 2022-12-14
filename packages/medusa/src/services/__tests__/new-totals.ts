import { asClass, asValue, createContainer } from "awilix"
import {
  defaultContainerMock,
  giftCards,
  giftCardsWithTaxRate,
  lineItems,
  shippingMethods,
} from "../__fixtures__/new-totals"
import { NewTotalsService } from "../index"
import { TaxCalculationContext } from "../../interfaces"
import { taxProviderServiceMock } from "../__mocks__/tax-provider"
import {
  Discount,
  DiscountRuleType,
  LineItem,
  ProductVariant,
  Region,
  ShippingMethod,
} from "../../models"
import { FlagRouter } from "../../utils/flag-router"
import TaxInclusivePricingFeatureFlag from "../../loaders/feature-flags/tax-inclusive-pricing"

describe("New totals service", () => {
  describe("Without [MEDUSA_FF_TAX_INCLUSIVE_PRICING]", () => {
    describe("getLineItemTotals", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register(
          "taxProviderService",
          asValue({
            ...taxProviderServiceMock,
            getTaxLinesMap: jest
              .fn()
              .mockImplementation(async (items: LineItem[]) => {
                const result = {
                  lineItemsTaxLines: {},
                }

                for (const item of items) {
                  result.lineItemsTaxLines[item.id] = [
                    {
                      item_id: item.id,
                      name: "default",
                      code: "default",
                      rate: 30,
                    },
                  ]
                }

                return result
              }),
          })
        )
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should use the items tax lines to compute the totals", async () => {
        const testItem = lineItems[0]

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            includeTax: true,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000, taxes 20%
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 1000,
            total: 1200,
            original_total: 1200,
            discount_total: 0,
            original_tax_total: 200,
            tax_total: 200,
            tax_lines: expect.arrayContaining(testItem.tax_lines),
          })
        )
      })

      it("should fetch the items tax lines to compute the totals", async () => {
        const testItem = { ...lineItems[0] } as LineItem
        testItem.variant = new ProductVariant()
        testItem.tax_lines = []

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            includeTax: true,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledTimes(1)
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledWith(
          [testItem],
          calculationContext
        )

        // unit_price: 1000, taxes 30%
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 1000,
            total: 1300,
            original_total: 1300,
            discount_total: 0,
            original_tax_total: 300,
            tax_total: 300,
            tax_lines: expect.arrayContaining([
              expect.objectContaining({
                name: "default",
                code: "default",
                rate: 30,
              }),
            ]),
          })
        )
      })

      it("should not use tax lines when includeTax is not true to compute the totals", async () => {
        const testItem = { ...lineItems[0] } as LineItem
        testItem.tax_lines = []

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            includeTax: false,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 1000,
            total: 1000,
            original_total: 1000,
            discount_total: 0,
            original_tax_total: 0,
            tax_total: 0,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })

      it("should use the provided tax rate to compute the totals", async () => {
        const testItem = lineItems[0]

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            taxRate: 20,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000, taxes 20%
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 1000,
            total: 1200,
            original_total: 1200,
            discount_total: 0,
            original_tax_total: 200,
            tax_total: 200,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })
    })

    describe("getShippingMethodTotals", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register(
          "taxProviderService",
          asValue({
            ...taxProviderServiceMock,
            getTaxLinesMap: jest
              .fn()
              .mockImplementation(
                async (
                  items: LineItem[],
                  calculationContext: TaxCalculationContext
                ) => {
                  const result = {
                    shippingMethodsTaxLines: {},
                  }

                  for (const method of calculationContext.shipping_methods) {
                    result.shippingMethodsTaxLines[method.id] = [
                      {
                        shipping_method_id: method.id,
                        name: "default",
                        code: "default",
                        rate: 30,
                      },
                    ]
                  }

                  return result
                }
              ),
          })
        )
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should use the shipping method tax lines to compute the totals", async () => {
        const testShippingMethod = shippingMethods[0]

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: true,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // price: 1000, taxes: 20%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 1000,
            total: 1200,
            original_total: 1200,
            original_tax_total: 200,
            tax_total: 200,
            tax_lines: expect.arrayContaining(testShippingMethod.tax_lines),
          })
        )
      })

      it("should fetch the shipping method tax lines to compute the totals", async () => {
        const testShippingMethod = { ...shippingMethods[0] } as ShippingMethod
        testShippingMethod.tax_lines = []

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: true,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledTimes(1)
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledWith(
          [],
          calculationContext
        )

        // price: 1000, taxes 30%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 1000,
            total: 1300,
            original_total: 1300,
            original_tax_total: 300,
            tax_total: 300,
            tax_lines: expect.arrayContaining([
              expect.objectContaining({
                name: "default",
                code: "default",
                rate: 30,
              }),
            ]),
          })
        )
      })

      it("should not use tax lines when includeTax is not true to compute the totals", async () => {
        const testShippingMethod = { ...shippingMethods[0] } as ShippingMethod
        testShippingMethod.tax_lines = []

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: false,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // price: 1000
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 1000,
            total: 1000,
            original_total: 1000,
            original_tax_total: 0,
            tax_total: 0,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })

      it("should use the provided tax rate to compute the totals", async () => {
        const testShippingMethod = shippingMethods[0]

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            taxRate: 20,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000, taxes 20%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 1000,
            total: 1000, // Legacy does not include the taxes
            original_total: 1000, // Legacy does not include the taxes
            original_tax_total: 200,
            tax_total: 200,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })

      it("should compute a total to 0 if a free shipping discount is present", async () => {
        const testShippingMethod = shippingMethods[0]

        const discounts = [
          {
            rule: {
              type: DiscountRuleType.FREE_SHIPPING,
            },
          },
        ] as Discount[]

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: true,
            calculationContext,
            discounts,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000, taxes 20%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 0,
            total: 0,
            original_total: 1200,
            original_tax_total: 200,
            tax_total: 0,
            tax_lines: expect.arrayContaining(testShippingMethod.tax_lines),
          })
        )
      })
    })

    describe("getLineItemRefund", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should compute the line item refundable amount", () => {
        const testItem = lineItems[0]

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const refundAmount = newTotalsService.getLineItemRefund(testItem, {
          calculationContext,
        })

        // unit_price: 1000, taxes: 20%
        expect(refundAmount).toEqual(1200)
      })

      it("should compute the line item refundable amount using the taxRate", () => {
        const testItem = lineItems[0]

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const refundAmount = newTotalsService.getLineItemRefund(testItem, {
          taxRate: 30,
          calculationContext,
        })

        // unit_price: 1000, taxes: 30%
        expect(refundAmount).toEqual(1300)
      })
    })

    describe("getGiftCardTotals", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should compute the gift cards totals amount in non taxable region", async () => {
        const maxAmount = 1000

        const testGiftCard = giftCards[0]

        const region = {
          gift_cards_taxable: false,
        } as Region

        const gitCardTotals = await newTotalsService.getGiftCardTotals(
          maxAmount,
          {
            giftCards: [testGiftCard],
            region,
          }
        )

        expect(gitCardTotals).toEqual(
          expect.objectContaining({
            total: 1000,
            tax_total: 0,
          })
        )
      })

      it("should compute the gift cards totals amount using the gift card tax rate", async () => {
        const maxAmount = 1000

        const testGiftCard = giftCardsWithTaxRate[0]

        const region = {
          // These values aren't involved in calculating tax rates for a gift card
          // GiftCard.tax_rate will be the source of truth for tax calculations
          // This is needed for giftCardTransactions backwards compatability reasons
          gift_cards_taxable: true,
          tax_rate: 0,
        } as Region

        const gitCardTotals = await newTotalsService.getGiftCardTotals(
          maxAmount,
          {
            giftCards: [testGiftCard],
            region,
          }
        )

        expect(gitCardTotals).toEqual(
          expect.objectContaining({
            total: 1000,
            tax_total: 200,
          })
        )
      })

      it("should compute the gift cards totals amount in non taxable region using gift card transactions", async () => {
        const maxAmount = 1000
        const testGiftCard = giftCards[0]
        const giftCardTransactions = [
          {
            tax_rate: 20,
            is_taxable: false,
            amount: 1000,
            gift_card: testGiftCard
          },
        ]

        const region = {
          gift_cards_taxable: false,
        } as Region

        const gitCardTotals = await newTotalsService.getGiftCardTotals(
          maxAmount,
          {
            giftCardTransactions,
            region,
          }
        )

        expect(gitCardTotals).toEqual(
          expect.objectContaining({
            total: 1000,
            tax_total: 200,
          })
        )
      })

      it("should compute the gift cards totals amount in a taxable region using gift card transactions", async () => {
        const maxAmount = 1000
        const testGiftCard = giftCards[0]
        const giftCardTransactions = [
          {
            tax_rate: 20,
            is_taxable: null,
            amount: 1000,
            gift_card: testGiftCard
          },
        ]

        const region = {
          gift_cards_taxable: true,
          tax_rate: 30,
        } as Region

        const gitCardTotals = await newTotalsService.getGiftCardTotals(
          maxAmount,
          {
            giftCardTransactions: giftCardTransactions,
            region,
          }
        )

        expect(gitCardTotals).toEqual(
          expect.objectContaining({
            total: 1000,
            tax_total: 300,
          })
        )
      })

      it("should compute the gift cards totals amount using gift card transactions for gift card with tax_rate", async () => {
        const maxAmount = 1000
        const testGiftCard = giftCardsWithTaxRate[0]
        const giftCardTransactions = [
          {
            tax_rate: 20,
            is_taxable: null,
            amount: 1000,
            gift_card: testGiftCard
          },
        ]

        const region = {
          // These values aren't involved in calculating tax rates for a gift card
          // GiftCard.tax_rate will be the source of truth for tax calculations
          // This is needed for giftCardTransactions backwards compatability reasons
          gift_cards_taxable: false,
          tax_rate: 99,
        } as Region

        const gitCardTotals = await newTotalsService.getGiftCardTotals(
          maxAmount,
          {
            giftCardTransactions: giftCardTransactions,
            region,
          }
        )

        expect(gitCardTotals).toEqual(
          expect.objectContaining({
            total: 1000,
            tax_total: 200,
          })
        )
      })
    })
  })

  describe("With [MEDUSA_FF_TAX_INCLUSIVE_PRICING]", () => {
    describe("getLineItemTotals", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register(
          "featureFlagRouter",
          asValue(
            new FlagRouter({
              [TaxInclusivePricingFeatureFlag.key]: true,
            })
          )
        )
        container.register(
          "taxProviderService",
          asValue({
            ...taxProviderServiceMock,
            getTaxLinesMap: jest
              .fn()
              .mockImplementation(async (items: LineItem[]) => {
                const result = {
                  lineItemsTaxLines: {},
                }

                for (const item of items) {
                  result.lineItemsTaxLines[item.id] = [
                    {
                      item_id: item.id,
                      name: "default",
                      code: "default",
                      rate: 30,
                    },
                  ]
                }

                return result
              }),
          })
        )
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should use the items tax lines to compute the totals", async () => {
        const testItem = { ...lineItems[0] } as LineItem
        testItem.includes_tax = true

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            includeTax: true,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000 including taxes, taxes 20%
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 833,
            total: 1000,
            original_total: 1000,
            discount_total: 0,
            original_tax_total: 167,
            tax_total: 167,
            tax_lines: expect.arrayContaining(testItem.tax_lines),
          })
        )
      })

      it("should fetch the tax lines to compute the totals", async () => {
        const testItem = { ...lineItems[0] } as LineItem
        testItem.tax_lines = []
        testItem.variant = new ProductVariant()
        testItem.includes_tax = true

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            includeTax: true,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledTimes(1)
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledWith(
          [testItem],
          calculationContext
        )

        // unit_price: 1000 including taxes, taxes 30%
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 769,
            total: 1000,
            original_total: 1000,
            discount_total: 0,
            original_tax_total: 231,
            tax_total: 231,
            tax_lines: expect.arrayContaining([
              expect.objectContaining({
                name: "default",
                code: "default",
                rate: 30,
              }),
            ]),
          })
        )
      })

      it("should not use tax lines when includeTax is not true to compute the totals", async () => {
        const testItem = { ...lineItems[0] } as LineItem
        testItem.includes_tax = true

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            includeTax: false,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000 including taxes
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 833,
            total: 1000,
            original_total: 1000,
            discount_total: 0,
            original_tax_total: 167,
            tax_total: 167,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })

      it("should use the provided tax rate to compute the totals", async () => {
        const testItem = lineItems[0]
        testItem.includes_tax = true

        const calculationContext = {
          allocation_map: {
            [testItem.id]: {},
          },
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const itemsTotalsMap = await newTotalsService.getLineItemTotals(
          [testItem],
          {
            taxRate: 20,
            calculationContext,
          }
        )

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000 including taxes, taxes 20%
        expect(itemsTotalsMap[testItem.id]).toEqual(
          expect.objectContaining({
            unit_price: 1000,
            subtotal: 833,
            total: 1000,
            original_total: 1000,
            discount_total: 0,
            original_tax_total: 167,
            tax_total: 167,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })
    })

    describe("getShippingMethodTotals", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register(
          "featureFlagRouter",
          asValue(
            new FlagRouter({
              [TaxInclusivePricingFeatureFlag.key]: true,
            })
          )
        )
        container.register(
          "taxProviderService",
          asValue({
            ...taxProviderServiceMock,
            getTaxLinesMap: jest
              .fn()
              .mockImplementation(
                async (
                  items: LineItem[],
                  calculationContext: TaxCalculationContext
                ) => {
                  const result = {
                    shippingMethodsTaxLines: {},
                  }

                  for (const method of calculationContext.shipping_methods) {
                    result.shippingMethodsTaxLines[method.id] = [
                      {
                        shipping_method_id: method.id,
                        name: "default",
                        code: "default",
                        rate: 30,
                      },
                    ]
                  }

                  return result
                }
              ),
          })
        )
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should use the shipping method tax lines to compute the totals", async () => {
        const testShippingMethod = shippingMethods[0]
        testShippingMethod.includes_tax = true

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: true,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // price: 1000 including taxes, taxes: 20%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 833,
            total: 1000,
            original_total: 1000,
            original_tax_total: 167,
            tax_total: 167,
            tax_lines: expect.arrayContaining(testShippingMethod.tax_lines),
          })
        )
      })

      it("should fetch shipping method tax lines to compute the totals", async () => {
        const testShippingMethod = { ...shippingMethods[0] } as ShippingMethod
        testShippingMethod.tax_lines = []
        testShippingMethod.includes_tax = true

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: true,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledTimes(1)
        expect(taxProviderService.getTaxLinesMap).toHaveBeenCalledWith(
          [],
          calculationContext
        )

        // price: 1000 including taxes, taxes 30%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 769,
            total: 1000,
            original_total: 1000,
            original_tax_total: 231,
            tax_total: 231,
            tax_lines: expect.arrayContaining([
              expect.objectContaining({
                name: "default",
                code: "default",
                rate: 30,
              }),
            ]),
          })
        )
      })

      it("should not use tax lines when includeTax is not true to compute the totals", async () => {
        const testShippingMethod = { ...shippingMethods[0] } as ShippingMethod
        testShippingMethod.tax_lines = []
        testShippingMethod.includes_tax = true

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: false,
            calculationContext,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // price: 1000 including taxes
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 1000,
            total: 1000,
            original_total: 1000,
            original_tax_total: 0,
            tax_total: 0,
            tax_lines: expect.arrayContaining([]),
          })
        )
      })

      // Not applicable to legacy shipping method totals calculation
      /*it("should use the provided tax rate to compute the totals", async () => {})*/

      it("should compute a total to 0 if a free shipping discount is present", async () => {
        const testShippingMethod = shippingMethods[0]
        testShippingMethod.includes_tax = true

        const discounts = [
          {
            rule: {
              type: DiscountRuleType.FREE_SHIPPING,
            },
          },
        ] as Discount[]

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [testShippingMethod],
        } as unknown as TaxCalculationContext

        const shippingMethodTotalsMap =
          await newTotalsService.getShippingMethodTotals([testShippingMethod], {
            includeTax: true,
            calculationContext,
            discounts,
          })

        const taxProviderService = container.resolve("taxProviderService")
        expect(taxProviderService.getTaxLinesMap).not.toHaveBeenCalled()

        // unit_price: 1000 including taxes, taxes 20%
        expect(shippingMethodTotalsMap[testShippingMethod.id]).toEqual(
          expect.objectContaining({
            price: 1000,
            subtotal: 0,
            total: 0,
            original_total: 1000,
            original_tax_total: 167,
            tax_total: 0,
            tax_lines: expect.arrayContaining(testShippingMethod.tax_lines),
          })
        )
      })
    })

    describe("getLineItemRefund", () => {
      let container
      let newTotalsService: NewTotalsService

      beforeEach(() => {
        container = createContainer({}, defaultContainerMock)
        container.register(
          "featureFlagRouter",
          asValue(
            new FlagRouter({
              [TaxInclusivePricingFeatureFlag.key]: true,
            })
          )
        )
        container.register("newTotalsService", asClass(NewTotalsService))
        newTotalsService = container.resolve("newTotalsService")
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it("should compute the line item refundable amount", () => {
        const testItem = lineItems[0]
        testItem.includes_tax = true

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const refundAmount = newTotalsService.getLineItemRefund(testItem, {
          calculationContext,
        })

        // unit_price: 1000 including taxes, taxes: 20%
        expect(refundAmount).toEqual(1000)
      })

      it("should compute the line item refundable amount using the taxRate", () => {
        const testItem = lineItems[0]
        testItem.includes_tax = true

        const calculationContext = {
          allocation_map: {},
          shipping_methods: [],
        } as unknown as TaxCalculationContext

        const refundAmount = newTotalsService.getLineItemRefund(testItem, {
          taxRate: 30,
          calculationContext,
        })

        // unit_price: 1000  including taxes, taxes: 30%
        expect(refundAmount).toEqual(1000)
      })
    })
  })
})
