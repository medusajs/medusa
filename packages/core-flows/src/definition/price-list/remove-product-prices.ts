import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { WorkflowTypes } from "@medusajs/types"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { Workflows } from "../../definitions"
import { PriceListHandlers } from "../../handlers"

export enum RemoveProductPricesActions {
  prepare = "prepare",
  removePriceListPriceSetPrices = "removePriceListPriceSetPrices",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: RemoveProductPricesActions.prepare,
    noCompensation: true,
    next: {
      action: RemoveProductPricesActions.removePriceListPriceSetPrices,
      noCompensation: true,
    },
  },
}

const handlers = new Map([
  [
    RemoveProductPricesActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: RemoveProductPricesActions.prepare,
          merge: true,
          invoke: {
            from: RemoveProductPricesActions.prepare,
          },
        },
        PriceListHandlers.prepareRemoveProductPrices
      ),
    },
  ],
  [
    RemoveProductPricesActions.removePriceListPriceSetPrices,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: RemoveProductPricesActions.prepare,
            alias: PriceListHandlers.createPriceLists.aliases.priceLists,
          },
        },
        PriceListHandlers.removePriceListPriceSetPrices
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.RemovePriceListProductPrices,
  workflowSteps,
  handlers
)

export const removePriceListProductPrices = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.RemovePriceListProductsWorkflowInputDTO,
  string[]
>(
  Workflows.RemovePriceListProductPrices,
  RemoveProductPricesActions.removePriceListPriceSetPrices
)
