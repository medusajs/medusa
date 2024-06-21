import { createWorkflow } from "@medusajs/workflows-sdk"
import { createPricingRuleTypesStep } from "../../pricing"
import { createDefaultSalesChannelStep } from "../../sales-channel"
import { createDefaultStoreStep } from "../steps/create-default-store"

export const createDefaultsWorkflowID = "create-defaults"
export const createDefaultsWorkflow = createWorkflow(
  createDefaultsWorkflowID,
  (input) => {
    const salesChannel = createDefaultSalesChannelStep({
      data: {
        name: "Default Sales Channel",
        description: "Created by Medusa",
      },
    })
    const store = createDefaultStoreStep({
      store: {
        default_sales_channel_id: salesChannel.id,
      },
    })

    createPricingRuleTypesStep([
      { name: "Region", rule_attribute: "region_id" },
      { name: "Customer Group", rule_attribute: "customer_group_id" },
    ])

    return store
  }
)
