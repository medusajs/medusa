import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"

import { InventoryTypes, WorkflowTypes } from "@medusajs/types"
import { InventoryHandlers } from "../../handlers"

export enum CreateInventoryItemActions {
  prepare = "prepare",
  createInventoryItems = "createInventoryItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateInventoryItemActions.prepare,
    noCompensation: true,
    next: {
      action: CreateInventoryItemActions.createInventoryItems,
    },
  },
}

const handlers = new Map([
  [
    CreateInventoryItemActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.InventoryItemsInputData,
          invoke: {
            from: InputAlias.InventoryItemsInputData,
          },
        },
        InventoryHandlers.createInventoryItemsPrepareData
      ),
    },
  ],
  [
    CreateInventoryItemActions.createInventoryItems,
    {
      invoke: pipe(
        {
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
  CreateInventoryItemActions.createInventoryItems
)
