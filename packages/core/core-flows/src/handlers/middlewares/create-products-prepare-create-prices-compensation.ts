import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[]
}

export async function createProductsPrepareCreatePricesCompensation({
  data,
}: WorkflowArguments<{
  preparedData: {
    productsHandleVariantsIndexPricesMap: Map<
      ProductHandle,
      VariantIndexAndPrices[]
    >
  }
  products: ProductTypes.ProductDTO[]
}>) {
  const productsHandleVariantsIndexPricesMap =
    data.preparedData.productsHandleVariantsIndexPricesMap
  const products = data.products

  const updatedProductsHandleVariantsIndexPricesMap = new Map()
  productsHandleVariantsIndexPricesMap.forEach(
    (existingItems, productHandle) => {
      const items =
        updatedProductsHandleVariantsIndexPricesMap.get(productHandle) ?? []

      existingItems.forEach(({ index }) => {
        items.push({
          index,
          prices: [],
        })
      })

      updatedProductsHandleVariantsIndexPricesMap.set(productHandle, items)
    }
  )

  return {
    alias: createProductsPrepareCreatePricesCompensation.aliases.output,
    value: {
      productsHandleVariantsIndexPricesMap:
        updatedProductsHandleVariantsIndexPricesMap,
      products,
    },
  }
}

createProductsPrepareCreatePricesCompensation.aliases = {
  preparedData: "preparedData",
  output: "createProductsPrepareCreatePricesCompensationOutput",
}
