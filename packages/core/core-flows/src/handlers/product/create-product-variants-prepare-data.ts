import { BigNumberInput, ProductWorkflow, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type VariantPrice = {
  region_id?: string
  currency_code?: string
  amount: BigNumberInput
  min_quantity?: BigNumberInput
  max_quantity?: BigNumberInput
}

export type CreateProductVariantsPreparedData = {
  productVariants: ProductWorkflow.CreateProductVariantsInputDTO[]
  variantIndexPricesMap: Map<number, VariantPrice[]>
  productVariantsMap: Map<
    string,
    ProductWorkflow.CreateProductVariantsInputDTO[]
  >
}

export async function createProductVariantsPrepareData({
  container,
  data,
}: // eslint-disable-next-line max-len
WorkflowArguments<WorkflowTypes.ProductWorkflow.CreateProductVariantsWorkflowInputDTO>): Promise<CreateProductVariantsPreparedData> {
  const productVariants: ProductWorkflow.CreateProductVariantsInputDTO[] =
    data.productVariants || []

  const variantIndexPricesMap = new Map<number, VariantPrice[]>()
  const productVariantsMap = new Map<
    string,
    ProductWorkflow.CreateProductVariantsInputDTO[]
  >()

  for (const [index, productVariantData] of productVariants.entries()) {
    if (!productVariantData.product_id) {
      continue
    }

    variantIndexPricesMap.set(index, productVariantData.prices || [])

    delete productVariantData.prices

    const productVariants = productVariantsMap.get(
      productVariantData.product_id
    )

    if (productVariants) {
      productVariants.push(productVariantData)
    } else {
      productVariantsMap.set(productVariantData.product_id, [
        productVariantData,
      ])
    }
  }

  return {
    productVariants,
    variantIndexPricesMap,
    productVariantsMap,
  }
}

createProductVariantsPrepareData.aliases = {
  payload: "payload",
}
