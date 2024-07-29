import { HttpTypes, IProductModuleService, ProductTypes } from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const groupProductsForBatchStepId = "group-products-for-batch"
export const groupProductsForBatchStep = createStep(
  groupProductsForBatchStepId,
  async (data: HttpTypes.AdminCreateProduct[], { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const existingProducts = await service.listProducts(
      {
        // We already validate that there is handle in a previous step
        handle: data.map((product) => product.handle) as string[],
      },
      { take: null, select: ["handle"] }
    )
    const existingProductsMap = new Map(
      existingProducts.map((p) => [p.handle, true])
    )

    const { toUpdate, toCreate } = data.reduce(
      (
        acc: {
          toUpdate: (HttpTypes.AdminUpdateProduct & { id: string })[]
          toCreate: HttpTypes.AdminCreateProduct[]
        },
        product
      ) => {
        // There are few data normalizations to do if we are dealing with an update.
        if (existingProductsMap.has(product.handle!)) {
          if (!(product as any).id) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Product id is required when updating products in import"
            )
          }

          acc.toUpdate.push(
            product as HttpTypes.AdminUpdateProduct & { id: string }
          )
          return acc
        }

        // New products will be created with a new ID, even if there is one present in the CSV.
        // To add support for creating with predefined IDs we will need to do changes to the upsert method.
        delete (product as any).id
        acc.toCreate.push(product)
        return acc
      },
      { toUpdate: [], toCreate: [] }
    )

    return new StepResponse({ create: toCreate, update: toUpdate })
  }
)
