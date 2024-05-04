import { IPricingModuleService } from "@medusajs/types"

export const createDefaultRuleTypes = async (container) => {
  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )

  return pricingModuleService.createRuleTypes([
    {
      name: "region_id",
      rule_attribute: "region_id",
    },
    {
      name: "customer_group_id",
      rule_attribute: "customer_group_id",
    },
  ])
}
