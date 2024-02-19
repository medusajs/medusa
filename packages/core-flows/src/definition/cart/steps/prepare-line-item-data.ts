import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateLineItemDTO, IProductModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

const VARIANT_PROPERTIES = [
  "title",
  "metadata",
  "product_id",
  "product.id",
  "product.title",
  "product.discountable",
  "product.is_giftcard",
]

interface StepInput {
  line_items: {
    variant_id: string
    quantity: number
    unit_price: number
  }[]
}

export const prepareLineItemDataStepId = "prepare-line-item-data"
export const prepareLineItemDataStep = createStep(
  prepareLineItemDataStepId,
  async (data: StepInput, { container }) => {
    if (!data.line_items?.length) {
      return []
    }

    const ids = data.line_items.map((i) => i.variant_id)

    const productModuleService = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const variants = await productModuleService.listVariants(
      {
        id: ids as string[],
      },
      { relations: ["product"] }
    )

    const idsMap = new Map(variants.map((v) => [v.id, true]))

    for (const item of data.line_items) {
      if (!item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "variant_id must be passed when creating a line item"
        )
      }

      if (!idsMap.has(item.variant_id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `variant with id: ${item.variant_id} not found`
        )
      }
    }

    const lineItems = data.line_items.map((item) => {
      const variant = variants.find((v) => v.id === item.variant_id)!

      return {
        quantity: item.quantity,
        title: variant.title,

        subtitle: variant.product.title,
        thumbnail: variant.product.thumbnail,

        product_id: variant.product.id,
        product_title: variant.product.title,
        product_description: variant.product.description,
        product_subtitle: variant.product.subtitle,
        product_type: variant.product.type[0].value,
        product_collection: variant.product.collection[0].value,
        product_handle: variant.product.handle,

        variant_id: variant.id,
        variant_sku: variant.sku,
        variant_barcode: variant.barcode,
        variant_title: variant.title,

        is_giftcard: variant.product.is_giftcard,

        unit_price: item.unit_price,
      } as CreateLineItemDTO
    })

    return new StepResponse(lineItems)
  }
)
