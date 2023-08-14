import { WorkflowTypes } from "@medusajs/types"
import { WorkflowDataPreparationArguments } from "../../helper"

export async function getProductVariantsPricing({
  container,
  context,
  data,
}: WorkflowDataPreparationArguments<{
  variantToLineItemsMap: Map<
    string,
    WorkflowTypes.CartWorkflow.AddLineItemToCartDTO
  >
  cart
}>) {
  const { manager } = context

  const productVariantService = container
    .resolve("productVariantService")
    .withTransaction(manager)
  const pricingService = container
    .resolve("pricingService")
    .withTransaction(manager)

  const variants = await productVariantService.list(
    {
      id: [...data.variantToLineItemsMap].map((vli) => vli[0]),
    },
    {
      relations: ["product"],
    }
  )

  // Map<string, ProductVariant>
  const variantsMap = new Map<string, any>()

  const variantsToCalculatePricingFor: {
    variantId: string
    quantity: number
  }[] = []

  for (const variant of variants) {
    variantsMap.set(variant.id, variant)

    const variantResolvedData = data.variantToLineItemsMap.get(variant.id)
    if (variantResolvedData?.unit_price == null) {
      variantsToCalculatePricingFor.push({
        variantId: variant.id,
        quantity: variantResolvedData!.quantity,
      })
    }
  }

  let variantsPricing = {}

  if (variantsToCalculatePricingFor.length) {
    variantsPricing = await pricingService.getProductVariantsPricing(
      variantsToCalculatePricingFor,
      {
        region_id: Cart.region_id,
        customer_id: context?.customer_id,
        include_discount_prices: true,
      }
    )
  }

  return {
    cart,
    lineItemsToCreate,
  }
}
