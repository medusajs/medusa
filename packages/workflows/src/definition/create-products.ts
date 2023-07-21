import { InputAlias, Workflows } from "../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { createProducts, removeProducts } from "../functions"
import { exportWorkflow, pipe } from "../helper"

enum Actions {
  createProduct = "createProduct",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.createProduct,
  },
}

const handlers = new Map([
  [
    Actions.createProduct,
    {
      invoke: pipe(
        {
          inputAlias: InputAlias.Products,
          invoke: {
            from: InputAlias.Products,
            alias: InputAlias.Products,
          },
        },
        createProducts
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createProduct,
            alias: InputAlias.Products,
          },
        },
        removeProducts
      ),
    },
  ],
])

WorkflowManager.register(Workflows.CreateProducts, workflowSteps, handlers)

export const createProduct = exportWorkflow(
  Workflows.CreateProducts,
  Actions.createProduct
)
