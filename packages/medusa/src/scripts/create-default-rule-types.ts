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
    { rule_attribute: ["region_id"] },
    { take: 1 }
  )

  if (existing.length) {
    return
  }

  await pricingModuleService.createRuleTypes([
    { name: "region_id", rule_attribute: "region_id" },
  ])
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
  })
  .catch(() => {
    console.log("Failed to create rule types")
  })
