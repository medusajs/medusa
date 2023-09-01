import { Workflows } from "../../definitions"
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

/**
 *  ******* STEPS *******
 *
 *  1. Update product (without variants)
 *  2. Prepare variants update
 *    2.1) delete variants not in payload
 *    2.2) update variants in payload
 *    2.3) create variants
 *      2.3.1) * TODO: handle inventory items
 *
 */

export const updateProductsWorkflowSteps: TransactionStepsDefinition = {
  next: {
    action: UpdateProductsActions.updateProducts,
    // next: {
    //   action: UpdateProductsActions.createInventoryItems,
    //   next: {
    //     action: UpdateProductsActions.attachInventoryItems,
    //   },
    // },
  },
}

const handlers = new Map([
  [
    UpdateProductsActions.updateProducts,
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
