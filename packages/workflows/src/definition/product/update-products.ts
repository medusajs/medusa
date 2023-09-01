import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import {
  InventoryHandlers,
  MiddlewaresHandlers,
  ProductHandlers,
} from "../../handlers"

export enum UpdateProductsActions {
  prepare = "prepare",
  updateProducts = "updateProducts",
}

export const updateProductsWorkflowSteps: TransactionStepsDefinition = {
  next: {
    action: UpdateProductsActions.prepare,
    noCompensation: true,
    next: {
      action: UpdateProductsActions.updateProducts,
      // next: {
      //   action: UpdateProductsActions.createInventoryItems,
      //   next: {
      //     action: UpdateProductsActions.attachInventoryItems,
      //   },
      // },
    },
  },
}

const handlers = new Map([
  [
    UpdateProductsActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
        },
        ProductHandlers.createProductsPrepareData
      ),
    },
  ],
  [
    UpdateProductsActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.prepare,
          },
        },
        ProductHandlers.updateProducts
      ),
      // compensate: pipe(
      //   {
      //     merge: true,
      //     invoke: {
      //       from: UpdateProductsActions.updateProducts,
      //       alias: ProductHandlers.removeProducts.aliases.products,
      //     },
      //   },
      //   ProductHandlers.removeProducts
      // ),
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
