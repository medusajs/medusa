import { AwilixContainer } from "awilix"
import { IPricingModuleService } from "@medusajs/types"

export const createDefaultRuleTypes = async (container: AwilixContainer) => {
  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )
  const existing = await pricingModuleService.listRuleTypes(
    { rule_attribute: ["region_id", "customer_group_id"] },
    { take: 2 }
  )

  if (existing.length === 2) {
    return
  }

  if (existing.length === 0) {
    await pricingModuleService.createRuleTypes([
      { name: "region_id", rule_attribute: "region_id" },
      { name: "customer_group_id", rule_attribute: "customer_group_id" },
    ])
  } else if (existing[0].rule_attribute === "region_id") {
    await pricingModuleService.createRuleTypes([
      { name: "customer_group_id", rule_attribute: "customer_group_id" },
    ])
  } else {
    await pricingModuleService.createRuleTypes([
      { name: "region_id", rule_attribute: "region_id" },
    ])
  }
}
