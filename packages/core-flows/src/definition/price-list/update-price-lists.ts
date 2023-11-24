import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { WorkflowTypes } from "@medusajs/types"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { Workflows } from "../../definitions"
import { PriceListHandlers } from "../../handlers"

export enum UpdatePriceListActions {
  prepare = "prepare",
  updatePriceList = "updatePriceList",
}

const workflowSteps: TransactionStepsDefinition = {
  action: UpdatePriceListActions.prepare,
  noCompensation: true,
  next: {
    next: {
      noCompensation: true,
      action: UpdatePriceListActions.updatePriceList,
    },
  },
}

const handlers = new Map([
  [
    UpdatePriceListActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: UpdatePriceListActions.prepare,
          merge: true,
          invoke: {
            from: UpdatePriceListActions.prepare,
          },
        },
        PriceListHandlers.prepareUpdatePriceLists
      ),
    },
  ],
  [
    UpdatePriceListActions.updatePriceList,
    {
      invoke: pipe(
        {
          inputAlias: UpdatePriceListActions.updatePriceList,
          merge: true,
          invoke: {
            from: UpdatePriceListActions.prepare,
          },
        },
        PriceListHandlers.updatePriceLists
      ),
    },
  ],
])

WorkflowManager.register(Workflows.UpdatePriceLists, workflowSteps, handlers)

export const updatePriceLists = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.UpdatePriceListWorkflowInputDTO,
  { priceList: WorkflowTypes.PriceListWorkflow.UpdatePriceListWorkflowDTO }[]
>(Workflows.UpdatePriceLists, UpdatePriceListActions.updatePriceList)
