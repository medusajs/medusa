import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { WorkflowTypes } from "@medusajs/types"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { Workflows } from "../../definitions"
import { PriceListHandlers } from "../../handlers"

export enum RemoveVariantPricesActions {
  prepare = "prepare",
  removePriceListPriceSetPrices = "removePriceListPriceSetPrices",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: RemoveVariantPricesActions.prepare,
    noCompensation: true,
    next: {
      action: RemoveVariantPricesActions.removePriceListPriceSetPrices,
      noCompensation: true,
    },
  },
}

const handlers = new Map([
  [
    RemoveVariantPricesActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: RemoveVariantPricesActions.prepare,
          merge: true,
          invoke: {
            from: RemoveVariantPricesActions.prepare,
          },
        },
        PriceListHandlers.prepareRemoveVariantPrices
      ),
    },
  ],
  [
    RemoveVariantPricesActions.removePriceListPriceSetPrices,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: RemoveVariantPricesActions.prepare,
            alias: PriceListHandlers.createPriceLists.aliases.priceLists,
          },
        },
        PriceListHandlers.removePriceListPriceSetPrices
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.RemovePriceListVariantPrices,
  workflowSteps,
  handlers
)

export const removePriceListVariantPrices = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.RemovePriceListVariantsWorkflowInputDTO,
  string[]
>(
  Workflows.RemovePriceListVariantPrices,
  RemoveVariantPricesActions.removePriceListPriceSetPrices
)
