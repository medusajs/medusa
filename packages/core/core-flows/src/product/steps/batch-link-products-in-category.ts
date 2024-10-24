import {
  IProductModuleService,
  ProductCategoryWorkflow,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const batchLinkProductsToCategoryStepId =
  "batch-link-products-to-category"
/**
 * This step creates links between product and category records.
 */
export const batchLinkProductsToCategoryStep = createStep(
  batchLinkProductsToCategoryStepId,
  async (
    data: ProductCategoryWorkflow.BatchUpdateProductsOnCategoryWorkflowInput,
    { container }
  ) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if (!data.add?.length && !data.remove?.length) {
      return new StepResponse(void 0, null)
    }

    const toRemoveSet = new Set(data.remove?.map((id) => id))
    const dbProducts = await service.listProducts(
      { id: [...(data.add ?? []), ...(data.remove ?? [])] },
      {
        select: ["id"],
        relations: ["categories"],
      }
    )

    const productsWithUpdatedCategories = dbProducts.map((p) => {
      if (toRemoveSet.has(p.id)) {
        return {
          id: p.id,
          category_ids: (p.categories ?? [])
            .filter((c) => c.id !== data.id)
            .map((c) => c.id),
        }
      }

      return {
        id: p.id,
        category_ids: [...(p.categories ?? []).map((c) => c.id), data.id],
      }
    })

    await service.upsertProducts(productsWithUpdatedCategories)

    return new StepResponse(void 0, {
      id: data.id,
      remove: data.remove,
      add: data.add,
      productIds: productsWithUpdatedCategories.map((p) => p.id),
    })
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const dbProducts = await service.listProducts(
      { id: prevData.productIds },
      {
        select: ["id"],
        relations: ["categories"],
      }
    )

    const toRemoveSet = new Set(prevData.remove?.map((id) => id))
    const productsWithRevertedCategories = dbProducts.map((p) => {
      if (toRemoveSet.has(p.id)) {
        return {
          id: p.id,
          category_ids: [...(p.categories ?? []).map((c) => c.id), prevData.id],
        }
      }

      return {
        id: p.id,
        category_ids: (p.categories ?? [])
          .filter((c) => c.id !== prevData.id)
          .map((c) => c.id),
      }
    })

    await service.upsertProducts(productsWithRevertedCategories)
  }
)
