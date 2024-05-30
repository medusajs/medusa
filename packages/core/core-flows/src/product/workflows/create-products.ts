import {
  CreateProductWorkflowInputDTO,
  PricingTypes,
  ProductTypes,
} from "@medusajs/types"
import { isPresent } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { associateProductsWithSalesChannelsStep } from "../../sales-channel"
import { createProductsStep } from "../steps/create-products"
import { createProductVariantsWorkflow } from "./create-product-variants"

type WorkflowInput = {
  products: CreateProductWorkflowInputDTO[]
}

export const createProductsWorkflowId = "create-products"
export const createProductsWorkflow = createWorkflow(
  createProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    // Passing prices to the product module will fail, we want to keep them for after the product is created.
    const productWithoutExternalRelations = transform({ input }, (data) =>
      data.input.products.map((p) => ({
        ...p,
        sales_channels: undefined,
        variants: undefined,
      }))
    )

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

    createProductVariantsWorkflow.runAsStep(variantsInput)

    return createdProducts
  }
)
