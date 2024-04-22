import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductCategoryWorkflow } from "@medusajs/types"
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

    const dbProducts = await service.list(
      {
        $or: [
          { categories: { id: { $in: [data.id] } } },
          { id: data.add ?? [] },
        ],
      },
      {
        take: null,
        select: ["id", "categories"],
      }
    )

    const toRemoveSet = new Set(data.remove?.map((id) => id))

    const products = dbProducts.filter((p) => !toRemoveSet.has(p.id))

    const input = products.map((p) => ({
      id: p.id,
      category_ids: [...(p.categories ?? []).map((c) => c.id), data.id],
    }))

    await service.upsert(input)

    return new StepResponse(void 0, {
      id: data.id,
      productIds: dbProducts.map((p) => p.id),
    })
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const dbProducts = await service.list(
      { id: prevData.productIds },
      {
        take: null,
        select: ["id", "categories"],
      }
    )

    const input = dbProducts.map((p) => ({
      p: p.id,
      category_ids: (p.categories ?? []).filter((c) => c.id !== prevData.id),
    }))

    await service.upsert(input)
  }
)
