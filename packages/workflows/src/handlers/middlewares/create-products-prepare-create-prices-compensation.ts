import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.ProductVariantPricesCreateReq[]
}

export async function createProductsPrepareCreatePricesCompensation({
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    updateProductsVariantsPricesInputData: {
      productsHandleVariantsIndexPricesMap: Map<
        ProductHandle,
        VariantIndexAndPrices[]
      >
    }
  }
}) {
  const productsHandleVariantsIndexPricesMap =
    data.updateProductsVariantsPricesInputData
      .productsHandleVariantsIndexPricesMap

  const updatedProductsHandleVariantsIndexPricesMap = new Map()
  productsHandleVariantsIndexPricesMap.forEach((items, productHandle) => {
    const existingItems =
      updatedProductsHandleVariantsIndexPricesMap.get(productHandle) ?? []

    items.forEach(({ index }) => {
      existingItems.push({
        index,
        prices: [],
      })
    })

    updatedProductsHandleVariantsIndexPricesMap.set(productHandle, items)
  })

  return {
    alias:
      createProductsPrepareCreatePricesCompensation.aliases
        .productsHandleVariantsIndexPricesMap,
    value: updatedProductsHandleVariantsIndexPricesMap,
  }
}

createProductsPrepareCreatePricesCompensation.aliases = {
  productsHandleVariantsIndexPricesMap: "productsHandleVariantsIndexPricesMap",
}
