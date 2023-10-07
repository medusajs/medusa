import {
  FlagRouter,
  ManyToManyInventoryFeatureFlag,
  MedusaError,
} from "@medusajs/utils"
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
import { IsType } from "../../../../utils"
import { EntityManager } from "typeorm"
import { ProductVariantInventoryService } from "../../../../services"

async function prepareAttachInventoryItems({ data }: WorkflowArguments) {
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
  const { variant_id } = req.validatedBody

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const entityManager: EntityManager = req.scope.resolve("manager")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const attachInventoryItemsWorkflow = attachInventoryItems(req.scope)

  if (!featureFlagRouter.isFeatureEnabled(ManyToManyInventoryFeatureFlag.key)) {
    const inventoryItems = await productVariantInventoryService.listByVariant(
      variant_id
    )

    if (inventoryItems.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Variant already associated with an inventory item."
      )
    }

    const items = await productVariantInventoryService.listByItem([id])
    if (items.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Inventory item already associated with a variant."
      )
    }
  }

  const { result } = await attachInventoryItemsWorkflow.run({
    input: { variantId: variant_id, inventoryItemId: id },
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
 *     description: The ID of the variant to create the inventory item for.
 *     type: string
 */
export class AdminPostInventoryItemsItemVariantsReq {
  @IsType([String, [String]])
  variant_id: string | string[]
}

export class AdminPostInventoryItemsItemVariantsParams extends FindParams {}
