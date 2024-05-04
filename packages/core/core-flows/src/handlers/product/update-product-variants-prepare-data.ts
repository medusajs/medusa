import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import {
  BigNumberInput,
  ProductTypes,
  ProductWorkflow,
  WorkflowTypes,
} from "@medusajs/types"
import { MedusaV2Flag } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type VariantPrice = {
  region_id?: string
  currency_code?: string
  amount: BigNumberInput
  min_quantity?: BigNumberInput
  max_quantity?: BigNumberInput
}

export type UpdateProductVariantsPreparedData = {
  productVariants: ProductWorkflow.UpdateProductVariantsInputDTO[]
  variantPricesMap: Map<string, VariantPrice[]>
  productVariantsMap: Map<
    string,
    ProductWorkflow.UpdateProductVariantsInputDTO[]
  >
}

export async function updateProductVariantsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductVariantsWorkflowInputDTO>): Promise<UpdateProductVariantsPreparedData> {
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )
  let productVariants: ProductWorkflow.UpdateProductVariantsInputDTO[] =
    data.productVariants || []

  const variantsDataMap = new Map<
    string,
    ProductWorkflow.UpdateProductVariantsInputDTO
  >(
    productVariants.map((productVariantData) => [
      productVariantData.id,
      productVariantData,
    ])
  )

  const variantIds = productVariants.map((pv) => pv.id) as string[]
  const productVariantsMap = new Map<
    string,
    ProductWorkflow.UpdateProductVariantsInputDTO[]
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
      take: null,
    }
  )

  for (const variantWithProductID of variantsWithProductIds) {
    const variantData = variantsDataMap.get(variantWithProductID.id)

    if (!variantData) {
      continue
    }

    variantPricesMap.set(variantWithProductID.id, variantData.prices || [])
    if (isPricingDomainEnabled) {
      delete variantData.prices
    }

    const variantsData: ProductWorkflow.UpdateProductVariantsInputDTO[] =
      productVariantsMap.get(variantWithProductID.product_id!) || []

    if (variantData) {
      variantsData.push(variantData)
    }

    productVariantsMap.set(variantWithProductID.product_id!, variantsData)
  }

  return {
    productVariants,
    variantPricesMap,
    productVariantsMap,
  }
}

updateProductVariantsPrepareData.aliases = {
  payload: "payload",
}
