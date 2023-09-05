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
  // variants
  updateProductsVariantsPrepareData = "updateProductsVariantsPrepareData",
  updateProductsVariants = "updateProductsVariants",
  removeProductsVariants = "removeProductsVariants",
  createProductsVariants = "createProductsVariants",
  // inventory
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
}

export const updateProductsWorkflowSteps: TransactionStepsDefinition = {
  next: {
    action: UpdateProductsActions.updateProducts,
    noCompensation: true, // TODO: compensate - revert TX
    next: {
      action: UpdateProductsActions.updateProductsVariantsPrepareData,
      next: [
        {
          action: UpdateProductsActions.removeProductsVariants,
        },
        {
          action: UpdateProductsActions.updateProductsVariants,
        },
        {
          action: UpdateProductsActions.createProductsVariants,
          next: {
            action: UpdateProductsActions.createInventoryItems,
            next: {
              action: UpdateProductsActions.attachInventoryItems,
            },
          },
        },
      ],
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
    UpdateProductsActions.updateProductsVariantsPrepareData,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.updateProducts,
          },
        },
        ProductHandlers.updateProductsVariantsPrepareData
      ),
    },
  ],
  [
    UpdateProductsActions.removeProductsVariants,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.updateProductsVariantsPrepareData,
          },
        },
        ProductHandlers.removeProductsVariants
      ),
      // compensate: TODO
    },
  ],
  [
    UpdateProductsActions.updateProductsVariants,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.updateProductsVariantsPrepareData,
          },
        },
        ProductHandlers.updateProductsVariants
      ),
      // compensate: TODO
    },
  ],
  [
    UpdateProductsActions.createProductsVariants,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.updateProductsVariantsPrepareData,
          },
        },
        ProductHandlers.createProductsVariants
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
            from: UpdateProductsActions.createProductsVariants,
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
