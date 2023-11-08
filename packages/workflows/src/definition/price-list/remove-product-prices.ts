import { WorkflowTypes } from "@medusajs/types"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"

import { PriceListHandlers } from "../../handlers"
import { Workflows } from "../../definitions"

export enum RemoveProductPricesActions {
  prepare = "prepare",
  removePriceSetPrices = "removePriceSetPrices",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: RemoveProductPricesActions.prepare,
    noCompensation: true,
    // next: {
    //   action: RemoveProductPricesActions.removePriceSetPrices,
    // },
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
  // [
  //   RemoveProductPricesActions.removePriceSetPrices,
  //   {
  //     invoke: pipe(
  //       {
  //         invoke: {
  //           from: RemoveProductPricesActions.prepare,
  //           alias: PriceListHandlers.createPriceLists.aliases.priceLists,
  //         },
  //       },
  //       PriceListHandlers.createPriceLists
  //     ),
  //     compensate: pipe(
  //       {
  //         invoke: {
  //           from: RemoveProductPricesActions.removePriceSetPrices,
  //           alias: PriceListHandlers.removePriceLists.aliases.priceLists,
  //         },
  //       },
  //       PriceListHandlers.removePriceLists
  //     ),
  //   },
  // ],
])

WorkflowManager.register(
  Workflows.RemovePriceListProducts,
  workflowSteps,
  handlers
)

export const removePriceListProductPrices = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.RemovePriceListProductsWorkflowInputDTO,
  void
>(
  Workflows.RemovePriceListProducts,
  RemoveProductPricesActions.removePriceSetPrices,
  async (data) => data
)
