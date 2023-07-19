import { InputAlias, Workflows } from "../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  attachInventoryItems,
  createInventoryItems,
  createProducts,
  removeInventoryItems,
  removeProducts,
} from "../functions"
import { emptyHandler, exportWorkflow, pipe } from "../helper"

enum Actions {
  createProduct = "createProduct",
  createPrices = "createPrices",
  attachToSalesChannel = "attachToSalesChannel",
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: Actions.createProduct,
    next: {
      action: Actions.attachToSalesChannel,
      next: {
        action: Actions.createPrices,
        next: {
          action: Actions.createInventoryItems,
          next: {
            action: Actions.attachInventoryItems,
          },
        },
      },
    },
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
            from: Actions.createProduct,
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

  [
    Actions.createInventoryItems,
    {
      invoke: pipe(
        {
          invoke: {
            from: Actions.createProduct,
            alias: InputAlias.Products,
          },
        },
        createInventoryItems
      ),
      compensate: pipe(
        {
          invoke: {
            from: Actions.createInventoryItems,
            alias: InputAlias.InventoryItems,
          },
        },
        removeInventoryItems
      ),
    },
  ],

  [
    Actions.attachInventoryItems,
    {
      invoke: pipe(
        {
          invoke: [
            {
              from: Actions.createInventoryItems,
              alias: InputAlias.InventoryItems,
            },
          ],
        },
        attachInventoryItems
      ),
      compensate: emptyHandler,
    },
  ],
])

WorkflowManager.register(Workflows.CreateProduct, workflowSteps, handlers)

export const createProduct = exportWorkflow(
  Workflows.CreateProduct,
  InputAlias.Products
)
