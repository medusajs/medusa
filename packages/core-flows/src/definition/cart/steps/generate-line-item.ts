import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, IProductModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  items: {
    variantId: string
    quantity: number
    metadata?: Record<string, any>
    unitPrice?: number
  }[]
  context: {
    regionId?: string
  }
}

export const generateLineItemStepId = "generate-line-item"
export const generateLineItemStep = createStep(
  generateLineItemStepId,
  async (data: StepInput, { container }) => {
    const regionId = data.context.regionId

    const itemsToGenerate = Array.isArray(data.items)
      ? data.items
      : [data.items]

    const resolvedDataMap = new Map(
      itemsToGenerate.map((d) => [d.variantId, d])
    )

    const productModuleService = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    // Retrieve variants
    const variants = await productModuleService.list(
      {
        id: itemsToGenerate.map((d) => d.variantId),
      },
      {
        relations: ["product"],
      }
    )

    // Validate that all variants has been found
    const inputDataVariantId = new Set(resolvedDataMap.keys())
    const foundVariants = new Set(variants.map((v) => v.id))
    const notFoundVariants = new Set(
      [...inputDataVariantId].filter((x) => !foundVariants.has(x))
    )

    if (notFoundVariants.size) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot generate the line items for non-existing variants: ${[
          ...notFoundVariants,
        ].join(", ")}`
      )
    }

    // Prepare data to retrieve variant pricing
    const variantsMap = new Map<string, any>()
    const variantsToCalculatePricingFor: {
      variantId: string
      quantity: number
    }[] = []

    for (const variant of variants) {
      variantsMap.set(variant.id, variant)

      const variantResolvedData = resolvedDataMap.get(variant.id)
      if (variantResolvedData?.unitPrice == null) {
        variantsToCalculatePricingFor.push({
          variantId: variant.id,
          quantity: variantResolvedData!.quantity,
        })
      }
    }

    let variantsPricing = {}

    const pricingModuleService = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )
    if (variantsToCalculatePricingFor.length) {
      variantsPricing = await pricingModuleService.calculatePrices()
      // .getProductVariantsPricing(variantsToCalculatePricingFor, {
      //   region_id: regionId,
      //   customer_id: context?.customer_id,
      //   include_discount_prices: true,
      // })
    }

    // Generate line items
    const generatedItems: [] = []

    for (const variantData of itemsToGenerate) {
      const variant = variantsMap.get(variantData.variantId)
      const variantPricing = variantsPricing[variantData.variantId]

      //   const lineItem = await this.generateLineItem(
      //     variant,
      //     variantData.quantity,
      //     {
      //       ...resolvedContext,
      //       unit_price: variantData.unit_price ?? resolvedContext.unit_price,
      //       metadata: variantData.metadata ?? resolvedContext.metadata,
      //       variantPricing,
      //     }
      //   )

      generatedItems.push()
    }

    return Array.isArray(data.items) ? generatedItems : generatedItems[0]
  }
)
