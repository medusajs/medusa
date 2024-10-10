import {
  MathBN,
  MedusaError,
  Modules,
  ProductWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { BigNumberInput } from "@medusajs/types"
import {
  emitEventStep,
  removeRemoteLinkStep,
  useRemoteQueryStep,
} from "../../common"
import { deleteProductsStep } from "../steps/delete-products"
import { getProductsStep } from "../steps/get-products"

export interface ValidateVariantInventoryStepInput {
  variants: {
    id: string
    inventory: { id: string; reserved_quantity: BigNumberInput }[]
  }[]
}

export const validateVariantInventoryStepId = "validate-variant-inventory"
export const validateVariantInventoryStep = createStep(
  validateVariantInventoryStepId,
  async (data: ValidateVariantInventoryStepInput) => {
    for (const variant of data.variants) {
      if (
        variant.inventory.some((inventoryItem) =>
          MathBN.gt(inventoryItem.reserved_quantity, 0)
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot remove variant which has reserved inventory quantity."
        )
      }
    }
  }
)

export type DeleteProductsWorkflowInput = { ids: string[] }

export const deleteProductsWorkflowId = "delete-products"
/**
 * This workflow deletes one or more products.
 */
export const deleteProductsWorkflow = createWorkflow(
  deleteProductsWorkflowId,
  (input: WorkflowData<DeleteProductsWorkflowInput>) => {
    const productsToDelete = getProductsStep({ ids: input.ids })
    const variantsToBeDeleted = transform({ productsToDelete }, (data) => {
      return data.productsToDelete
        .flatMap((product) => product.variants)
        .map((variant) => variant.id)
    })

    const variantsWithInventory = useRemoteQueryStep({
      entry_point: "variants",
      fields: [
        "id",
        "inventory.id",
        "inventory.reserved_quantity",
        "inventory.variants.id",
      ],
      variables: {
        id: variantsToBeDeleted,
      },
      list: true,
    })

    validateVariantInventoryStep({ variants: variantsWithInventory })

    const [, deletedProduct] = parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: {
          variant_id: variantsToBeDeleted,
          product_id: input.ids,
        },
      }).config({ name: "remove-product-variant-link-step" }),
      deleteProductsStep(input.ids)
    )

    const productIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: ProductWorkflowEvents.DELETED,
      data: productIdEvents,
    })

    const productsDeleted = createHook("productsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProduct, {
      hooks: [productsDeleted],
    })
  }
)
