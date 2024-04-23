import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createProductsWorkflow } from "../workflows/create-products"
import { updateProductsWorkflow } from "../workflows/update-products"
import { deleteProductsWorkflow } from "../workflows/delete-products"
import {
  BatchWorkflowInput,
  CreateProductWorkflowInputDTO,
  UpdateProductWorkflowInputDTO,
} from "@medusajs/types"

export const batchProductsStepId = "batch-products"
export const batchProductsStep = createStep(
  batchProductsStepId,
  async (
    data: BatchWorkflowInput<
      CreateProductWorkflowInputDTO,
      UpdateProductWorkflowInputDTO
    >,
    { container }
  ) => {
    const { transaction: createTransaction, result: created } =
      await createProductsWorkflow(container).run({
        input: { products: data.create ?? [] },
      })
    const { transaction: updateTransaction, result: updated } =
      await updateProductsWorkflow(container).run({
        input: { products: data.update ?? [] },
      })
    const { transaction: deleteTransaction } = await deleteProductsWorkflow(
      container
    ).run({
      input: { ids: data.delete ?? [] },
    })

    return new StepResponse(
      {
        created,
        updated,
        deleted: {
          ids: data.delete ?? [],
          object: "product",
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
      await createProductsWorkflow(container).cancel({
        transaction: flow.createTransaction,
      })
    }

    if (flow.updateTransaction) {
      await updateProductsWorkflow(container).cancel({
        transaction: flow.updateTransaction,
      })
    }

    if (flow.deleteTransaction) {
      await deleteProductsWorkflow(container).cancel({
        transaction: flow.deleteTransaction,
      })
    }
  }
)
