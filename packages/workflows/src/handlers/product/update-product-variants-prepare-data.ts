import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductTypes, ProductWorkflow, WorkflowTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type VariantPrice = {
  region_id?: string
  currency_code?: string
  amount: number
  min_quantity?: number
  max_quantity?: number
}

export type UpdateProductVariantsPreparedData = {
  productVariants: ProductTypes.UpdateProductVariantDTO[]
  variantPricesMap: Map<string, VariantPrice[]>
  productVariantsMap: Map<string, ProductTypes.UpdateProductVariantDTO[]>
}

export async function updateProductVariantsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductVariantsWorkflowInputDTO>): Promise<UpdateProductVariantsPreparedData> {
  let productVariants: ProductWorkflow.UpdateProductVariantsInputDTO[] =
    data.productVariants || []

  const variantIds = productVariants.map((pv) => pv.id) as string[]
  const productVariantsMap = new Map<
    string,
    ProductTypes.UpdateProductVariantDTO[]
  >()
  const variantPricesMap = new Map<string, VariantPrice[]>()

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  const variantsWithProductIds = await productModuleService.listVariants(
    {
      id: variantIds,
    },
    {
      select: ["id", "product_id"],
    }
  )

  variantsWithProductIds.forEach((v) => {
    const variantData = productVariants.find((pv) => pv.id === v.id)

    variantPricesMap.set(v.id, variantData?.prices || [])
    delete variantData?.prices

    const variantsData: ProductTypes.UpdateProductVariantDTO[] =
      productVariantsMap.get(v.product_id) || []

    if (variantData) variantsData.push(variantData as any)

    productVariantsMap.set(v.product_id, variantsData)
  })

  return {
    productVariants,
    variantPricesMap,
    productVariantsMap,
  }
}

updateProductVariantsPrepareData.aliases = {
  payload: "payload",
}
