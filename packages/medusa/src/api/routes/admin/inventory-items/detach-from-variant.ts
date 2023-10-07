import {
  pipe,
  Handlers,
  exportWorkflow,
  WorkflowArguments,
  Workflows,
} from "@medusajs/workflows"

import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { EntityManager } from "typeorm"

async function prepareDetachInventoryItems({ data }: WorkflowArguments) {
  const { variantId, inventoryItemId } = data

  let arrayOfVariantIds: string[] = variantId
  if (!Array.isArray(variantId)) {
    arrayOfVariantIds = [variantId]
  }

  return {
    inventoryItems: arrayOfVariantIds.map((variantId) => ({
      tag: variantId,
      inventoryItem: { id: inventoryItemId },
    })),
  }
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: "prepare",
    noCompensation: true,
    next: {
      action: "detachInventoryItemToVariants",
    },
  },
}

const handlers = new Map([
  [
    "prepare",
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: "input",
          invoke: {
            from: "input",
          },
        },
        prepareDetachInventoryItems
      ),
    },
  ],
  [
    "detachInventoryItemToVariants",
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: "prepare",
          },
        },
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
  "detachInventoryItemToVariants"
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
