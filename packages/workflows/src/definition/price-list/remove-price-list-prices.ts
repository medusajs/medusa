import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { WorkflowTypes } from "@medusajs/types"
import { exportWorkflow, pipe } from "../../helper"

import { Workflows } from "../../definitions"
import { PriceListHandlers } from "../../handlers"

export enum RemovePriceListPricesActions {
  prepare = "prepare",
  removePriceListPrices = "removePriceListPrices",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: RemovePriceListPricesActions.prepare,
    noCompensation: true,
    next: {
      action: RemovePriceListPricesActions.removePriceListPrices,
      noCompensation: true,
    },
  },
}

const handlers = new Map([
  [
    RemovePriceListPricesActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: RemovePriceListPricesActions.prepare,
          merge: true,
          invoke: {
            from: RemovePriceListPricesActions.prepare,
          },
        },
        PriceListHandlers.prepareRemovePriceListPrices
      ),
    },
  ],
  [
    RemovePriceListPricesActions.removePriceListPrices,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: RemovePriceListPricesActions.prepare,
          },
        },
        PriceListHandlers.removePrices
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.RemovePriceListPrices,
  workflowSteps,
  handlers
)

export const removePriceListProductPrices = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.RemovePriceListPricesWorkflowInputDTO,
  string[]
>(
  Workflows.RemovePriceListPrices,
  RemovePriceListPricesActions.removePriceListPrices
)
