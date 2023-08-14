import { WorkflowDataPreparationArguments } from "../../helper"

type GetProductVariantPricingInput = {
  variant_id: string
  quantity: number
}

type HandlerInput = {
  variantPricingData: GetProductVariantPricingInput[]
  context: {
    customer_id?: string
    region_id: string
  }
}

export async function getProductVariantsPricing({
  container,
  context,
  data,
}: WorkflowDataPreparationArguments<HandlerInput>) {
  const { manager } = context

  const productVariantService = container
    .resolve("productVariantService")
    .withTransaction(manager)
  const pricingService = container
    .resolve("pricingService")
    .withTransaction(manager)

  const variants = await productVariantService.list(
    {
      id: data.variantPricingData.map((vli) => vli[0]),
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
    const pricingData = data.variantPricingData.find(variant.id)

    variantsToCalculatePricingFor.push({
      variantId: variant.id,
      quantity: pricingData!.quantity,
    })
  }

  let variantsPricing = {}

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
    variantsPricing,
  }
}
