import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { deleteProductVariantsWorkflow } from "../workflows/delete-product-variants"
import { createProductVariantsWorkflow } from "../workflows/create-product-variants"
import { updateProductVariantsWorkflow } from "../workflows/update-product-variants"
import {
  BatchWorkflowInput,
  CreateProductVariantWorkflowInputDTO,
  UpdateProductVariantWorkflowInputDTO,
} from "@medusajs/types"

export const batchProductVariantsStepId = "batch-product-variants"
export const batchProductVariantsStep = createStep(
  batchProductVariantsStepId,
  async (
    data: BatchWorkflowInput<
      CreateProductVariantWorkflowInputDTO,
      UpdateProductVariantWorkflowInputDTO
    >,
    { container }
  ) => {
    const {
      transaction: createTransaction,
      result: created,
      errors: createErrors,
    } = await createProductVariantsWorkflow(container).run({
      input: { product_variants: data.create ?? [] },
      throwOnError: false,
    })

    if (createErrors?.length) {
      throw createErrors[0].error
    }

    const {
      transaction: updateTransaction,
      result: updated,
      errors: updateErrors,
    } = await updateProductVariantsWorkflow(container).run({
      input: { product_variants: data.update ?? [] },
      throwOnError: false,
    })

    if (updateErrors?.length) {
      throw updateErrors[0].error
    }

    const { transaction: deleteTransaction, errors: deleteErrors } =
      await deleteProductVariantsWorkflow(container).run({
        input: { ids: data.delete ?? [] },
        throwOnError: false,
      })

    if (deleteErrors?.length) {
      throw deleteErrors[0].error
    }

    return new StepResponse(
      {
        created,
        updated,
        deleted: {
          ids: data.delete ?? [],
          object: "product_variant",
          deleted: true,
        },
      },
      { createTransaction, updateTransaction, deleteTransaction }
    )
  },

  async (flow, { container }) => {
    if (!flow) {
      return
    }

    if (flow.createTransaction) {
      await createProductVariantsWorkflow(container).cancel({
        transaction: flow.createTransaction,
      })
    }

    if (flow.updateTransaction) {
      await updateProductVariantsWorkflow(container).cancel({
        transaction: flow.updateTransaction,
      })
    }

    if (flow.deleteTransaction) {
      await deleteProductVariantsWorkflow(container).cancel({
        transaction: flow.deleteTransaction,
      })
    }
  }
)
