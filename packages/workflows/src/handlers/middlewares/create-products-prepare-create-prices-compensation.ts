import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[]
}

export async function createProductsPrepareCreatePricesCompensation({
  data,
}: WorkflowArguments<{
  productsHandleVariantsIndexPricesMap: Map<
    ProductHandle,
    VariantIndexAndPrices[]
  >
  products: ProductTypes.ProductDTO[]
}>) {
  const productsHandleVariantsIndexPricesMap =
    data.productsHandleVariantsIndexPricesMap
  const products = data.products

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
    alias: "",
    value: {
      productsHandleVariantsIndexPricesMap:
        updatedProductsHandleVariantsIndexPricesMap,
      products,
    },
  }
}

createProductsPrepareCreatePricesCompensation.aliases = {
  payload: "payload",
}
