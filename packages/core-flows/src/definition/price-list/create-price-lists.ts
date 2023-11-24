import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { PricingTypes, WorkflowTypes } from "@medusajs/types"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { Workflows } from "../../definitions"
import { PriceListHandlers } from "../../handlers"

export enum CreatePriceListActions {
  prepare = "prepare",
  createPriceList = "createPriceList",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreatePriceListActions.prepare,
    noCompensation: true,
    next: {
      action: CreatePriceListActions.createPriceList,
    },
  },
}

const handlers = new Map([
  [
    CreatePriceListActions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: CreatePriceListActions.prepare,
          merge: true,
          invoke: {
            from: CreatePriceListActions.prepare,
          },
        },
        PriceListHandlers.prepareCreatePriceLists
      ),
    },
  ],
  [
    CreatePriceListActions.createPriceList,
    {
      invoke: pipe(
        {
          invoke: {
            from: CreatePriceListActions.prepare,
            alias: PriceListHandlers.createPriceLists.aliases.priceLists,
          },
        },
        PriceListHandlers.createPriceLists
      ),
      compensate: pipe(
        {
          invoke: {
            from: CreatePriceListActions.createPriceList,
            alias: PriceListHandlers.removePriceLists.aliases.priceLists,
          },
        },
        PriceListHandlers.removePriceLists
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreatePriceList, workflowSteps, handlers)

export const createPriceLists = exportWorkflow<
  WorkflowTypes.PriceListWorkflow.CreatePriceListWorkflowInputDTO,
  {
    priceList: PricingTypes.CreatePriceListDTO
  }[]
>(Workflows.CreatePriceList, CreatePriceListActions.createPriceList)
