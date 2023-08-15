import { ProductVariantPricingDTO } from "@medusajs/types"
import { WorkflowDataPreparationArguments } from "../../helper"

type GetProductVariantPricingInput = {
  variant_id: string
  quantity: number
}

type HandlerInput = {
  variants: GetProductVariantPricingInput[]
  context: {
    region_id: string
    customer_id?: string
  }
}

type HandlerOutput = {
  variantsPricing: ProductVariantPricingDTO | {}
}

export async function getProductVariantsPricing({
  container,
  context,
  data,
}: WorkflowDataPreparationArguments<HandlerInput>): Promise<HandlerOutput> {
  const { manager } = context

  const productVariantService = container
    .resolve("productVariantService")
    .withTransaction(manager)
  const pricingService = container
    .resolve("pricingService")
    .withTransaction(manager)

  const variants = await productVariantService.list(
    {
      id: data.variants.map((vli) => vli[0]),
    },
    {
      relations: ["product"],
    }
  )

  const variantsToCalculatePricingFor: {
    variantId: string
    quantity: number
  }[] = []

  for (const variant of variants) {
    const pricingData = data.variants.find(variant.id)

    variantsToCalculatePricingFor.push({
      variantId: variant.id,
      quantity: pricingData!.quantity,
    })
  }

  let variantsPricing: ProductVariantPricingDTO | {} = {}

  if (variantsToCalculatePricingFor.length) {
    variantsPricing = await pricingService.getProductVariantsPricing(
      variantsToCalculatePricingFor,
      {
        region_id: data.context.region_id,
        customer_id: data.context?.customer_id,
        include_discount_prices: true,
      }
    )
  }

  return {
    variantsPricing: variantsPricing ?? {},
  }
}
