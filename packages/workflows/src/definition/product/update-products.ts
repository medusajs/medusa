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
  updateProductsVariantsPrepareData = "updateProductsVariantsPrepareData",
  updateProductsVariants = "updateProductsVariants",
}

/**
 *  ******* STEPS *******
 *
 *  1. Update product (without variants)
 *   --- if no variants in the payload -> stop here
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
    noCompensation: true, // TODO: compensate - revert TX
    next: {
      action: UpdateProductsActions.updateProductsVariantsPrepareData,
      next: {
        action: UpdateProductsActions.updateProductsVariants,
        // next: {
        //   action: UpdateProductsActions.createInventoryItems,
        //   next: {
        //     action: UpdateProductsActions.attachInventoryItems,
        //   },
        // },
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
