import { IPricingModuleService, PriceListDTO } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

export async function removePriceLists({
  container,
  data,
}: WorkflowArguments<{
  price_lists: {
    price_list: PriceListDTO
  }[]
}>): Promise<
  {
    price_list: PriceListDTO
  }[]
> {
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  await pricingService!.deletePriceLists(
    data.price_lists.map(({ price_list }) => price_list.id)
  )

  return data.price_lists
}

removePriceLists.aliases = {
  priceLists: "priceLists",
}
