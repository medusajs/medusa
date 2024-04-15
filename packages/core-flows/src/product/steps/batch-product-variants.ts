import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { deleteProductVariantsWorkflow } from "../workflows/delete-product-variants"
import { createProductVariantsWorkflow } from "../workflows/create-product-variants"
import { updateProductVariantsWorkflow } from "../workflows/update-product-variants"
import { PricingTypes, ProductTypes } from "@medusajs/types"

type BatchProductVariantsInput = {
  create: (ProductTypes.CreateProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  })[]
  update: (ProductTypes.UpsertProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  })[]
  delete: string[]
}

export const batchProductVariantsStepId = "batch-product-variants"
export const batchProductVariantsStep = createStep(
  batchProductVariantsStepId,
  async (data: BatchProductVariantsInput, { container }) => {
    const { transaction: createTransaction, result: created } =
      await createProductVariantsWorkflow(container).run({
        input: { product_variants: data.create },
      })
    const { transaction: updateTransaction, result: updated } =
      await updateProductVariantsWorkflow(container).run({
        input: { product_variants: data.update },
      })
    const { transaction: deleteTransaction } =
      await deleteProductVariantsWorkflow(container).run({
        input: { ids: data.delete },
      })

    return new StepResponse(
      {
        created,
        updated,
        deleted: {
          ids: data.delete,
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
