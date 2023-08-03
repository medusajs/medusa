import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[]
}

export async function createProductsPrepareCreatePricesCompensation({
  data,
}: WorkflowArguments<{
  updateProductsVariantsPricesInputData: {
    productsHandleVariantsIndexPricesMap: Map<
      ProductHandle,
      VariantIndexAndPrices[]
    >
  }
}>) {
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
