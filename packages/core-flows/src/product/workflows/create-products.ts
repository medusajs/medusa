import { ProductTypes, PricingTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createProductsStep } from "../steps/create-products"
import { createVariantPricingLinkStep } from "../steps/create-variant-pricing-link"
import { createPriceSetsStep } from "../../pricing"
import { associateProductsWithSalesChannelsStep } from "../../sales-channel"
import { CreateProductWorkflowInputDTO } from "@medusajs/types/src"

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
        variants: p.variants?.map((v) => ({
          ...v,
          prices: undefined,
        })),
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

    // Note: We rely on the same order of input and output when creating products here, ensure this always holds true
    const variantsWithAssociatedPrices = transform(
      { input, createdProducts },
      (data) => {
        return data.createdProducts
          .map((p, i) => {
            const inputProduct = data.input.products[i]
            return p.variants?.map((v, j) => ({
              ...v,
              prices: inputProduct?.variants?.[j]?.prices ?? [],
            }))
          })
          .flat()
      }
    )

    const pricesToCreate = transform({ variantsWithAssociatedPrices }, (data) =>
      data.variantsWithAssociatedPrices.map((v) => ({
        prices: v.prices ?? [],
      }))
    )

    const createdPriceSets = createPriceSetsStep(pricesToCreate)

    const variantAndPriceSets = transform(
      { variantsWithAssociatedPrices, createdPriceSets },
      (data) =>
        data.variantsWithAssociatedPrices.map((variant, i) => ({
          variant: variant,
          price_set: data.createdPriceSets[i],
        }))
    )

    const variantAndPriceSetLinks = transform(
      { variantAndPriceSets },
      (data) => {
        return {
          links: data.variantAndPriceSets.map((entry) => ({
            variant_id: entry.variant.id,
            price_set_id: entry.price_set.id,
          })),
        }
      }
    )

    createVariantPricingLinkStep(variantAndPriceSetLinks)

    return createdProducts
  }
)
