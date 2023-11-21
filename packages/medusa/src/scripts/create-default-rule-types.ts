import { AwilixContainer } from "awilix"
import { IPricingModuleService } from "@medusajs/types"
import dotenv from "dotenv"
import express from "express"
import loaders from "../loaders"

dotenv.config()

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

const migrate = async function ({ directory }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  return await createDefaultRuleTypes(container)
}

migrate({ directory: process.cwd() })
  .then(() => {
    console.log("Created default rule types")
    process.exit()
  })
  .catch(() => {
    console.log("Failed to create rule types")
    process.exit(1)
  })
