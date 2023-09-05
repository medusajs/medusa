import { ProductTypes, WorkflowTypes } from "@medusajs/types"

import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"
import { ProductHandlers } from "../../handlers"

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
