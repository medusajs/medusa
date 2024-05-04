import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../../definitions"
import { exportWorkflow, pipe } from "@medusajs/workflows-sdk"

import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { ProductHandlers } from "../../handlers"

export enum CreateProductVariantsActions {
  prepare = "prepare",
  createProductVariants = "createProductVariants",
  revertProductVariantsCreate = "revertProductVariantsCreate",
  upsertPrices = "upsertPrices",
}

export const workflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateProductVariantsActions.prepare,
    noCompensation: true,
    next: {
      action: CreateProductVariantsActions.createProductVariants,
      next: [
        {
          action: CreateProductVariantsActions.upsertPrices,
        },
      ],
    },
  },
}

const handlers = new Map([
  [
    CreateProductVariantsActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.ProductVariantsCreateInputData,
          invoke: {
            from: InputAlias.ProductVariantsCreateInputData,
          },
        },
        ProductHandlers.createProductVariantsPrepareData
      ),
    },
  ],
  [
    CreateProductVariantsActions.createProductVariants,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: CreateProductVariantsActions.prepare,
          },
        },
        ProductHandlers.createProductVariants
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: [
            {
              from: CreateProductVariantsActions.prepare,
            },
            {
              from: CreateProductVariantsActions.createProductVariants,
            },
          ],
        },
        ProductHandlers.removeProductVariants
      ),
    },
  ],
  [
    CreateProductVariantsActions.upsertPrices,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: CreateProductVariantsActions.createProductVariants,
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
              from: CreateProductVariantsActions.prepare,
            },
            {
              from: CreateProductVariantsActions.upsertPrices,
            },
          ],
        },
        ProductHandlers.revertVariantPrices
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.CreateProductVariants,
  workflowSteps,
  handlers
)

export const createProductVariants = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductVariantsWorkflowInputDTO,
  ProductTypes.ProductVariantDTO[]
>(
  Workflows.CreateProductVariants,
  CreateProductVariantsActions.createProductVariants
)
