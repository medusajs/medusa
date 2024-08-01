import { HttpTypes, IProductModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const groupProductsForBatchStepId = "group-products-for-batch"
export const groupProductsForBatchStep = createStep(
  groupProductsForBatchStepId,
  async (
    data: (HttpTypes.AdminCreateProduct & { id?: string })[],
    { container }
  ) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const existingProducts = await service.listProducts(
      {
        // We use the ID to do product updates
        id: data.map((product) => product.id).filter(Boolean) as string[],
      },
      { take: null, select: ["handle"] }
    )
    const existingProductsSet = new Set(existingProducts.map((p) => p.id))

    const { toUpdate, toCreate } = data.reduce(
      (
        acc: {
          toUpdate: (HttpTypes.AdminUpdateProduct & { id: string })[]
          toCreate: HttpTypes.AdminCreateProduct[]
        },
        product
      ) => {
        // There are few data normalizations to do if we are dealing with an update.
        if (product.id && existingProductsSet.has(product.id)) {
          acc.toUpdate.push(
            product as HttpTypes.AdminUpdateProduct & { id: string }
          )
          return acc
        }

        // New products will be created with a new ID, even if there is one present in the CSV.
        // To add support for creating with predefined IDs we will need to do changes to the upsert method.
        delete product.id
        acc.toCreate.push(product)
        return acc
      },
      { toUpdate: [], toCreate: [] }
    )

    return new StepResponse({ create: toCreate, update: toUpdate })
  }
)
