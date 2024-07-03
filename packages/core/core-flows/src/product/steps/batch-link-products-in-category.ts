import { IProductModuleService, ProductCategoryWorkflow } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const batchLinkProductsToCategoryStepId =
  "batch-link-products-to-category"
export const batchLinkProductsToCategoryStep = createStep(
  batchLinkProductsToCategoryStepId,
  async (
    data: ProductCategoryWorkflow.BatchUpdateProductsOnCategoryWorkflowInput,
    { container }
  ) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    if (!data.add?.length && !data.remove?.length) {
      return new StepResponse(void 0, null)
    }

    const toRemoveSet = new Set(data.remove?.map((id) => id))
    const dbProducts = await service.listProducts(
      { id: [...(data.add ?? []), ...(data.remove ?? [])] },
      {
        take: null,
        select: ["id", "categories"],
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

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const dbProducts = await service.listProducts(
      { id: prevData.productIds },
      {
        take: null,
        select: ["id", "categories"],
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
