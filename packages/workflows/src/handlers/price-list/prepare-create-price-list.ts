import {
  CreatePriceListDTO,
  CreatePriceListRuleDTO,
  PriceListStatus,
} from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type Result = {
  tag?: string
  priceList: Omit<CreatePriceListDTO, "rules" | "prices">
  rules: CreatePriceListRuleDTO[]
  prices: string[] //CreatePriceListPriceDTO
}[]

export async function prepareCreatePriceLists({
  container,
  data,
}: WorkflowArguments<{
  priceLists: (CreatePriceListWorkflowDTO & { _associationTag?: string })[]
}>): Promise<Result | void> {
  // const pricingService: IPricingModuleService =
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

  const { priceLists } = data

  priceLists.map((priceListDTO) => {
    priceListDTO.title ??= priceListDTO.name
    const {
      _associationTag,
      customer_groups,
      rules = [],
      type,
      includes_tax,
      name,
      // prices,
      ...priceList
    } = priceListDTO

    return { priceList, prices: [], rules, tag: _associationTag }
  })
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}

export interface CreatePriceListWorkflowDTO {
  name: string
  title?: string
  description: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
  customer_groups: { id: string }[]
  rules?: CreatePriceListRuleDTO[]
  type?: string
  includes_tax?: boolean
  // prices: PriceListPriceDTO[];
}
