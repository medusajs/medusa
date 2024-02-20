import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  variantIds: string[]
}

export const validateVariantsExistStepId = "validate-variants-exist"
export const validateVariantsExistStep = createStep(
  validateVariantsExistStepId,
  async (data: StepInput, { container }) => {
    const productModuleService = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const variants = await productModuleService.listVariants(
      {
        id: data.variantIds,
      },
      {
        relations: ["product"],
      }
    )

    const variantIdToData = new Map(variants.map((v) => [v.id, v]))

    const notFoundVariants = new Set(
      [...data.variantIds].filter((x) => !variantIdToData.has(x))
    )

    if (notFoundVariants.size) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variants with IDs ${[...notFoundVariants].join(", ")} do not exist`
      )
    }

    return new StepResponse(Object.fromEntries(variants.map((v) => [v.id, v])))
  }
)
