import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { UpdateProductsStepInput } from "./update-products"
import { IProductModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export const getVariantIdsForProductsStepId = "get-variant-ids-for-products"
export const getVariantIdsForProductsStep = createStep(
  getVariantIdsForProductsStepId,
  async (data: UpdateProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )
    let filters = {}
    if ("products" in data) {
      if (!data.products.length) {
        return new StepResponse([])
      }

      filters = {
        id: data.products.map((p) => p.id),
      }
    } else {
      filters = data.selector
    }

    const products = await service.listProducts(filters, {
      select: ["variants.id"],
      relations: ["variants"],
      take: null,
    })

    return new StepResponse(
      products.flatMap((p) => p.variants.map((v) => v.id))
    )
  }
)
