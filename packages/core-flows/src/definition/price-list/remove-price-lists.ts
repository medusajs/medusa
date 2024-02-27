import { WorkflowTypes } from "@medusajs/types"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { PriceListHandlers } from "../../handlers"
import { Workflows } from "../../definitions"

export enum RemovePriceListActions {
  removePriceList = "removePriceList",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: RemovePriceListActions.removePriceList,
    noCompensation: true,
  },
}

const handlers = new Map([
  [
    RemovePriceListActions.removePriceList,
    {
      invoke: pipe(
        {
          inputAlias: RemovePriceListActions.removePriceList,
          merge: true,
          invoke: {
            from: RemovePriceListActions.removePriceList,
          },
        },
        PriceListHandlers.removePriceLists
      ),
    },
  ],
])

WorkflowManager.register(Workflows.DeletePriceLists, workflowSteps, handlers)

export const removePriceLists = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.RemovePriceListWorkflowInputDTO,
  {
    price_list_ids: string[]
  }
>(
  Workflows.DeletePriceLists,
  RemovePriceListActions.removePriceList,
  async (data) => {
    return {
      price_lists: data.price_lists.map((priceListId) => ({
        price_list: { id: priceListId },
      })),
    }
  }
)
