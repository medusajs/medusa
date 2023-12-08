import { createWorkflow } from "@medusajs/workflows-sdk"
import { prepareImportPriceListPrices } from "./prepare-price-list-import"
import { deletePriceListPrices } from "./delete-existing-price-list-prices"
import { createPriceListPrices } from "./add-new-prices"

export type workflowInput = {
  priceListId: string
  operations: Record<string, string | number | (string | number | object)[]>[]
}

export const importPriceListWorkflow = createWorkflow<workflowInput, void>(
  "import-price-list",
  function (input) {
    const prep = prepareImportPriceListPrices(input)

    deletePriceListPrices({ prep, input })

    createPriceListPrices({
      input,
      prep,
    })
  }
)
