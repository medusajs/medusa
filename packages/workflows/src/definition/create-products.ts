import { InputAlias, Workflows } from "../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  createProducts as createProductsHandler,
  removeProducts,
} from "../handlers"
import { exportWorkflow, pipe } from "../helper"

import { ProductTypes } from "@medusajs/types"
import { createProductsPrepareData } from "../handlers/pipes/create-products-prepare-data"

export enum Actions {
  prepare = "prepare",
  createProducts = "createProducts",
  attachToSalesChannel = "attachToSalesChannel",
  attachShippingProfile = "attachShippingProfile",
  createPrices = "createPrices",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
  result = "result",
}

export const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.prepare,
    noCompensation: true,
    next: {
      action: Actions.createProducts,
      next: [
        {
          action: Actions.attachShippingProfile,
          saveResponse: false,
        },
        {
          action: Actions.attachToSalesChannel,
          saveResponse: false,
        },
        {
          action: Actions.createPrices,
          next: {
            action: Actions.createInventoryItems,
            next: {
              action: Actions.attachInventoryItems,
              next: {
                action: Actions.result,
                noCompensation: true,
              },
            },
          },
        },
      ],
    },
  },
}

const handlers = new Map([
  [
    Actions.prepare,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
            alias: InputAlias.ProductsInputData,
          },
        },
        createProductsPrepareData
      ),
    },
  ],
  [
    Actions.createProducts,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.Products,
          invoke: {
            from: InputAlias.Products,
            alias: InputAlias.Products,
          },
        },
        createProductsHandler
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProducts,
            alias: InputAlias.Products,
          },
        },
        removeProducts
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProducts = exportWorkflow<
  ProductTypes.CreateProductDTO[],
  ProductTypes.ProductDTO[]
>(Workflows.CreateProducts, Actions.createProducts)
