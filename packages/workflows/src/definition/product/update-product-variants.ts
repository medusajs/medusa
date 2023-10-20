import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { InputAlias, Workflows } from "../../definitions"
import { exportWorkflow, pipe } from "../../helper"

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
          noCompensation: true,
          saveResponse: false,
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
      // compensate: pipe(
      //   {
      //     merge: true,
      //     invoke: {
      //       from: UpdateProductVariantsActions.revertProductVariantsUpdate,
      //       alias:
      //         ProductHandlers.revertProductVariants.aliases.productVariants,
      //     },
      //   },
      //   ProductHandlers.revertProductVariantsUpdate
      // ),
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
              from: InputAlias.ProductVariantsUpdateInputData,
            },
            // {
            //   from: UpdateProductVariantsActions.updateProductVariants,
            //   alias:
            //     ProductHandlers.upsertVariantPrices.aliases
            //       .productVariants,
            // },
          ],
        },
        ProductHandlers.upsertVariantPrices
      ),
      // compensate: pipe(
      //   {
      //     merge: true,
      //     invoke: [
      //       {
      //         from: UpdateProductVariantsActions.prepare,
      //         alias:
      //           MiddlewaresHandlers
      //             .createProductsPrepareCreatePricesCompensation.aliases
      //             .preparedData,
      //       },
      //       {
      //         from: UpdateProductVariantsActions.updateProductVariants,
      //         alias:
      //           ProductHandlers.upsertVariantPrices.aliases
      //             .productVariants,
      //       },
      //     ],
      //   },
      //   MiddlewaresHandlers.createProductsPrepareCreatePricesCompensation,
      //   ProductHandlers.upsertVariantPrices
      // ),
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
