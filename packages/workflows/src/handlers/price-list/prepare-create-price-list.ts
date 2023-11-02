import { CreatePriceListDTO, CreatePriceListRuleDTO, IPricingModuleService, PriceListDTO } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "../../helper"

type Result = {
  tag: string
  priceList: PriceListDTO
  rules: CreatePriceListRuleDTO[]
  prices: CreatePriceListPriceDTO[]
}[]

export async function prepareCreatePriceLists({
  container,
  data,
}: WorkflowArguments<{
  priceLists: (CreatePriceListDTO & { _associationTag?: string })[]
}>): Promise<Result | void> {
  const pricingService: IPricingModuleService =
  //   container.resolve(ModuleRegistrationName.PRICING)

  // if (!pricingService) {
  //   const logger = container.resolve("logger")
  //   logger.warn(
  //     `Pricing service not found. You should install the @medusajs/pricing package to use pricing. The 'createPriceList' step will be skipped.`
  //   )
  //   return void 0
  // }

  // return await Promise.all(
  //   data.priceLists.map(async (item) => {
  //     const [priceList] = await pricingService!.createPriceLists([{
       
  //     }])

  //     return { tag: item._associationTag ?? priceList.id, priceList }
  //   })
  // )


}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}
