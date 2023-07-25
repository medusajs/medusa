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

enum Actions {
  createProducts = "createProducts",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.createProducts,
  },
}

const handlers = new Map([
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
