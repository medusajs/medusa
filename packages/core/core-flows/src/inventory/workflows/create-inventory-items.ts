import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createInventoryItemsStep } from "../steps"

import { LinkDefinition } from "@medusajs/modules-sdk"
import { CreateVariantInventoryItemWorkflowInput } from "@medusajs/types/src"
import { Modules } from "../../../../modules-sdk/src/definitions"
import { createLinkStep } from "../../common"

export const createInventoryItemsWorkflowId = "create-inventory-items-workflow"
export const createInventoryItemsWorkflow = createWorkflow(
  createInventoryItemsWorkflowId,
  (input: WorkflowData<CreateVariantInventoryItemWorkflowInput>) => {
    const variantItemsMap = createInventoryItemsStep(input.items)

    const variantItemsLinks = transform(variantItemsMap, (map) => {
      const linkDefinitions: LinkDefinition[] = []

      for (const [variant_id, items] of map) {
        for (const item of items) {
          linkDefinitions.push({
            [Modules.PRODUCT]: { variant_id },
            [Modules.INVENTORY]: { inventory_item_id: item.id },
          })
        }
      }

      return linkDefinitions
    })

    createLinkStep(variantItemsLinks)

    return variantItemsMap
  }
)
