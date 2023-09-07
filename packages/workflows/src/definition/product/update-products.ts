import { ProductTypes, WorkflowTypes } from "@medusajs/types"

import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"
import { InventoryHandlers, ProductHandlers } from "../../handlers"

export enum UpdateProductsActions {
  updateProducts = "updateProducts",
  // inventory
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

// TODO: sales channels
// TODO: shipping profiles

export const updateProductsWorkflowSteps: TransactionStepsDefinition = {
  next: {
    action: UpdateProductsActions.updateProducts,
    noCompensation: true, // TODO: compensate - revert TX
    next: {
      action: UpdateProductsActions.createInventoryItems,
      next: {
        action: UpdateProductsActions.attachInventoryItems,
      },
    },
  },
}

const handlers = new Map([
  [
    UpdateProductsActions.updateProducts,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
        },
        ProductHandlers.updateProducts
      ),
      // compensate: TODO
    },
  ],
  [
    UpdateProductsActions.createInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.updateProducts,
            alias: ProductHandlers.updateProducts.aliases.products,
          },
        },
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.removeInventoryItems
      ),
    },
  ],
  [
    UpdateProductsActions.attachInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.attachInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.detachInventoryItems
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.UpdateProducts,
  updateProductsWorkflowSteps,
  handlers
)

export const updateProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO,
  ProductTypes.ProductDTO[]
>(Workflows.UpdateProducts, UpdateProductsActions.updateProducts)
