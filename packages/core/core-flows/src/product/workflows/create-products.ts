import {
  AdditionalData,
  CreateProductWorkflowInputDTO,
  PricingTypes,
  ProductTypes,
} from "@medusajs/framework/types"
import {
  ProductWorkflowEvents,
  isPresent,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { associateProductsWithSalesChannelsStep } from "../../sales-channel"
import { createProductsStep } from "../steps/create-products"
import { createProductVariantsWorkflow } from "./create-product-variants"

interface ValidateProductInputStepInput {
  products: CreateProductWorkflowInputDTO[]
}

const validateProductInputStepId = "validate-product-input"
/**
 * This step validates a product data before creation.
 */
const validateProductInputStep = createStep(
  validateProductInputStepId,
  async (data: ValidateProductInputStepInput) => {
    const { products } = data

    const missingOptionsProductTitles = products
      .filter((product) => !product.options?.length)
      .map((product) => product.title)

    if (missingOptionsProductTitles.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product options are not provided for: [${missingOptionsProductTitles.join(
          ", "
        )}].`
      )
    }
  }
)

export type CreateProductsWorkflowInput = {
  products: CreateProductWorkflowInputDTO[]
} & AdditionalData

export const createProductsWorkflowId = "create-products"
/**
 * This workflow creates one or more products.
 */
export const createProductsWorkflow = createWorkflow(
  createProductsWorkflowId,
  (input: WorkflowData<CreateProductsWorkflowInput>) => {
    // Passing prices to the product module will fail, we want to keep them for after the product is created.
    const productWithoutExternalRelations = transform({ input }, (data) =>
      data.input.products.map((p) => ({
        ...p,
        sales_channels: undefined,
        variants: undefined,
      }))
    )

    validateProductInputStep({ products: productWithoutExternalRelations })

    const createdProducts = createProductsStep(productWithoutExternalRelations)

    const salesChannelLinks = transform({ input, createdProducts }, (data) => {
      return data.createdProducts
        .map((createdProduct, i) => {
          const inputProduct = data.input.products[i]
          return (
            inputProduct.sales_channels?.map((salesChannel) => ({
              sales_channel_id: salesChannel.id,
              product_id: createdProduct.id,
            })) ?? []
          )
        })
        .flat()
    })

    associateProductsWithSalesChannelsStep({ links: salesChannelLinks })

    const variantsInput = transform({ input, createdProducts }, (data) => {
      // TODO: Move this to a unified place for all product workflow types
      const productVariants: (ProductTypes.CreateProductVariantDTO & {
        prices?: PricingTypes.CreateMoneyAmountDTO[]
      })[] = []

      data.createdProducts.forEach((product, i) => {
        const inputProduct = data.input.products[i]

        for (const inputVariant of inputProduct.variants || []) {
          isPresent(inputVariant) &&
            productVariants.push({
              product_id: product.id,
              ...inputVariant,
            })
        }
      })

      return {
        input: { product_variants: productVariants },
      }
    })

    const createdVariants =
      createProductVariantsWorkflow.runAsStep(variantsInput)

    const response = transform(
      { createdVariants, input, createdProducts },
      (data) => {
        const variantMap: Record<string, ProductTypes.ProductVariantDTO[]> = {}

        for (const variant of data.createdVariants) {
          const array = variantMap[variant.product_id!] || []

          array.push(variant)

          variantMap[variant.product_id!] = array
        }

        for (const product of data.createdProducts) {
          product.variants = variantMap[product.id] || []
        }

        return data.createdProducts
      }
    )

    const productIdEvents = transform({ response }, ({ response }) => {
      return response.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductWorkflowEvents.CREATED,
      data: productIdEvents,
    })

    const productsCreated = createHook("productsCreated", {
      products: response,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(response, {
      hooks: [productsCreated],
    })
  }
)
