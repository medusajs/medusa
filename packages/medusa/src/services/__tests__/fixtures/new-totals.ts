import { asClass, asValue, createContainer } from "awilix"
import { IdMap, MockManager } from "medusa-test-utils"
import { taxProviderServiceMock } from "../../__mocks__/tax-provider"
import { FlagRouter } from "../../../utils/flag-router"
import { LineItem, LineItemTaxLine } from "../../../models"
import TaxCalculationStrategy from "../../../strategies/tax-calculation"

export const defaultContainerMock = createContainer()
defaultContainerMock.register("manager", asValue(MockManager))
defaultContainerMock.register(
  "taxProviderService",
  asValue(taxProviderServiceMock)
)
defaultContainerMock.register("featureFlagRouter", asValue(new FlagRouter({})))
defaultContainerMock.register(
  "taxCalculationStrategy",
  asClass(TaxCalculationStrategy)
)

export const lineItemsWithTaxLines = [
  {
    id: IdMap.getId("item_1_with_tax_lines"),
    cart_id: "",
    order_id: "",
    swap_id: "",
    claim_order_id: "",
    title: "title",
    description: "description",
    unit_price: 1000,
    quantity: 1,
    tax_lines: [
      {
        id: IdMap.getId("item_1_with_tax_lines+tax_line_1"),
        item_id: IdMap.getId("item_1_with_tax_lines"),
        rate: 20,
        name: "default",
        code: "default",
      },
    ] as LineItemTaxLine[],
  },
] as LineItem[]
