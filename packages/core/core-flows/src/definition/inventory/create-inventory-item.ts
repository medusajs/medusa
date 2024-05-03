import { Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { InventoryTypes, WorkflowTypes } from "@medusajs/types"
import { InventoryHandlers } from "../../handlers"

export enum CreateInventoryItemActions {
  prepare = "prepare",
  createInventoryItems = "createInventoryItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateInventoryItemActions.createInventoryItems,
  },
}

const handlers = new Map([
  [
    CreateInventoryItemActions.createInventoryItems,
    {
      invoke: pipe(
        {
          inputAlias: CreateInventoryItemActions.prepare,
          merge: true,
          invoke: {
            from: CreateInventoryItemActions.prepare,
          },
        },
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: CreateInventoryItemActions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.removeInventoryItems
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.CreateInventoryItems,
  workflowSteps,
  handlers
)

export const createInventoryItems = exportWorkflow<
  WorkflowTypes.InventoryWorkflow.CreateInventoryItemsWorkflowInputDTO,
  { tag: string; inventoryItem: InventoryTypes.InventoryItemDTO }[]
>(
  Workflows.CreateInventoryItems,
  CreateInventoryItemActions.createInventoryItems,
  async (data) => data
)
