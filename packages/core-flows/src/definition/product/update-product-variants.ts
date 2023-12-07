import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../../definitions"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { ProductHandlers } from "../../handlers"

export enum UpdateProductVariantsActions {
  prepare = "prepare",
  updateProductVariants = "updateProductVariants",
  revertProductVariantsUpdate = "revertProductVariantsUpdate",
  upsertPrices = "upsertPrices",
}

export const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: UpdateProductVariantsActions.prepare,
    noCompensation: true,
    next: {
      action: UpdateProductVariantsActions.updateProductVariants,
      noCompensation: true,
      next: [
        {
          action: UpdateProductVariantsActions.upsertPrices,
        },
      ],
    },
  },
}

const handlers = new Map([
  [
    UpdateProductVariantsActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.ProductVariantsUpdateInputData,
          invoke: {
            from: InputAlias.ProductVariantsUpdateInputData,
          },
        },
        ProductHandlers.updateProductVariantsPrepareData
      ),
    },
  ],
  [
    UpdateProductVariantsActions.updateProductVariants,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductVariantsActions.prepare,
          },
        },
        ProductHandlers.updateProductVariants
      ),
    },
  ],
  [
    UpdateProductVariantsActions.upsertPrices,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductVariantsActions.prepare,
            },
          ],
        },
        ProductHandlers.upsertVariantPrices
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductVariantsActions.prepare,
            },
            {
              from: UpdateProductVariantsActions.upsertPrices,
            },
          ],
        },
        ProductHandlers.revertVariantPrices
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.UpdateProductVariants,
  workflowSteps,
  handlers
)

export const updateProductVariants = exportWorkflow<
  WorkflowTypes.ProductWorkflow.UpdateProductVariantsWorkflowInputDTO,
  ProductTypes.ProductVariantDTO[]
>(
  Workflows.UpdateProductVariants,
  UpdateProductVariantsActions.updateProductVariants
)
