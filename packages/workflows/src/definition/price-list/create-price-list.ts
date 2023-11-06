import { PricingTypes, WorkflowTypes } from "@medusajs/types"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"

import { PriceListHandlers } from "../../handlers"
import { Workflows } from "../../definitions"

export enum CreatePriceListActions {
  prepare = "prepare",
  createPriceList = "createPriceList",
  createPriceRules = "createPriceRules",
  createPriceListPrices = "createPriceListPrices",
}

const workflowSteps: TransactionStepsDefinition = {
  action: CreatePriceListActions.prepare,
  next: {
    next: {
      action: CreatePriceListActions.createPriceList,
      next: {
        action: CreatePriceListActions.createPriceRules,
        next: {
          action: CreatePriceListActions.createPriceListPrices,
        },
      },
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
        PriceListHandlers.createPriceLists
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: CreatePriceListActions.createPriceList,
            alias: PriceListHandlers.removePriceLists.aliases.priceLists,
          },
        },
        PriceListHandlers.removePriceLists
      ),
    },
  ],
  [
    CreatePriceListActions.createPriceList,
    {
      invoke: pipe(
        {
          inputAlias: CreatePriceListActions.prepare,
          merge: true,
          invoke: {
            from: CreatePriceListActions.prepare,
          },
        },
        PriceListHandlers.createPriceLists
      ),
      compensate: pipe(
        {
          merge: true,
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
  WorkflowTypes.PriceListWorkflow.CreatePriceListDTO,
  { priceList: PricingTypes.CreatePriceListDTO }[]
>(
  Workflows.CreatePriceList,
  CreatePriceListActions.createPriceList,
  async (data) => data
)
