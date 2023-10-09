import {
  pipe,
  Handlers,
  exportWorkflow,
  WorkflowArguments,
  Workflows,
} from "@medusajs/workflows"

import { FindParams } from "../../../../types/common"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { EntityManager } from "typeorm"
import { IsInt, IsOptional, IsString } from "class-validator"

async function prepareAttachInventoryItems({ data }: WorkflowArguments) {
  const { variantId, inventoryItemId, requiredQuantity } = data

  let arrayOfVariantIds: string[] = variantId
  if (!Array.isArray(variantId)) {
    arrayOfVariantIds = [variantId]
  }

  return {
    inventoryItems: arrayOfVariantIds.map((variantId) => ({
      tag: variantId,
      inventoryItem: { id: inventoryItemId },
      requiredQuantity,
    })),
  }
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: "prepare",
    noCompensation: true,
    next: {
      action: "attachInventoryItemToVariants",
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
        prepareAttachInventoryItems
      ),
    },
  ],
  [
    "attachInventoryItemToVariants",
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: "prepare",
          },
        },
        Handlers.InventoryHandlers.attachInventoryItems
      ),
    },
  ],
])

interface AttachInventoryItemsWorkflowInput {
  variantId: string | string[]
  inventoryItemId: string
  requiredQuantity?: number
}

WorkflowManager.register(
  "attach-inventory-item-to-variant",
  workflowSteps,
  handlers
)
const attachInventoryItems = exportWorkflow<
  AttachInventoryItemsWorkflowInput,
  [string, string][]
>(
  "attach-inventory-item-to-variant" as Workflows,
  "attachInventoryItemToVariants"
)

export default async (req, res) => {
  const { id } = req.params
  const { variant_id, required_quantity } =
    req.validatedBody as AdminPostInventoryItemsItemVariantsReq

  const entityManager: EntityManager = req.scope.resolve("manager")
  const attachInventoryItemsWorkflow = attachInventoryItems(req.scope)

  const { result } = await attachInventoryItemsWorkflow.run({
    input: {
      variantId: variant_id,
      inventoryItemId: id,
      requiredQuantity: required_quantity,
    },
    context: {
      manager: entityManager,
    },
  })

  res.status(200).json({
    inventory_item: {
      id: result[0],
      variant_ids: result[1],
    },
  })
}

/**
 * @schema AdminPostInventoryItemsItemVariantsReq
 * type: object
 * required:
 *   - variant_id
 * properties:
 *   variant_id:
 *     description: The ID of the variant to associate the inventory item with.
 *     type: string
 *   required_quantity:
 *     description: The quantity of the inventory item required to fulfill the variant.
 *     type: string
 */
export class AdminPostInventoryItemsItemVariantsReq {
  @IsString()
  variant_id: string

  @IsInt()
  @IsOptional()
  required_quantity?: number
}

export class AdminPostInventoryItemsItemVariantsParams extends FindParams {}
