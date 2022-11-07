import { asClass, asValue, createContainer } from "awilix"
import {
  defaultContainerMock,
  lineItemsWithTaxLines,
} from "./fixtures/new-totals"
import { NewTotalsService } from "../index"
import { TaxCalculationContext } from "../../interfaces"
import { taxProviderServiceMock } from "../__mocks__/tax-provider"
import { LineItem } from "../../models"

describe("New totals service", () => {
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
      const testItem = lineItemsWithTaxLines[0]

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
          useExistingTaxLines: true,
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

    it("should not use the items tax lines to compute the totals", async () => {
      const testItem = lineItemsWithTaxLines[0]

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
          useExistingTaxLines: false,
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
  })
})
