import { pipe, Handlers, exportWorkflow, Workflows } from "@medusajs/workflows"

import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { EntityManager } from "typeorm"

const workflowSteps: TransactionStepsDefinition = {
  next: { action: "detachInventoryItemFromVariants" },
}

const handlers = new Map([
  [
    "detachInventoryItemFromVariants",
    {
      invoke: pipe(
        { merge: true, inputAlias: "prepare", invoke: { from: "prepare" } },
        Handlers.InventoryHandlers.detachInventoryItems
      ),
    },
  ],
])

interface DetachInventoryItemsWorkflowInput {
  variantId: string
  inventoryItemId: string
}

WorkflowManager.register(
  "detach-inventory-item-to-variant",
  workflowSteps,
  handlers
)
const detachInventoryItems = exportWorkflow<
  DetachInventoryItemsWorkflowInput,
  [string, string][]
>(
  "detach-inventory-item-to-variant" as Workflows,
  "detachInventoryItemToVariants",
  async (data) => {
    const { variantId, inventoryItemId } = data
    let arrayOfVariantIds: string[] = Array.isArray(variantId)
      ? variantId
      : [variantId]
    return {
      inventoryItems: arrayOfVariantIds.map((variantId) => ({
        tag: variantId,
        inventoryItem: { id: inventoryItemId },
      })),
    }
  }
)

export default async (req, res) => {
  const { id, variant_id } = req.params

  const entityManager: EntityManager = req.scope.resolve("manager")

  const detachInventoryItemsWorkflow = detachInventoryItems(req.scope)

  await detachInventoryItemsWorkflow.run({
    input: {
      variantId: variant_id,
      inventoryItemId: id,
    },
    context: {
      manager: entityManager,
    },
  })

  res.status(200).json({ inventory_item: { id } })
}
