import { ProductTypes, PricingTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createProductsStep, createVariantPricingLinkStep } from "../steps"
import { createPriceSetsStep } from "../../pricing"

// TODO: We should have separate types here as input, not the module DTO. Eg. the HTTP request that we are handling
// has different data than the DTO, so that needs to be represented differently.
type WorkflowInput = {
  products: (Omit<ProductTypes.CreateProductDTO, "variants"> & {
    variants?: (ProductTypes.CreateProductVariantDTO & {
      prices?: PricingTypes.CreateMoneyAmountDTO[]
    })[]
  })[]
}

export const createProductsWorkflowId = "create-products"
export const createProductsWorkflow = createWorkflow(
  createProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    // Passing prices to the product module will fail, we want to keep them for after the product is created.
    const productWithoutPrices = transform({ input }, (data) =>
      data.input.products.map((p) => ({
        ...p,
        variants: p.variants?.map((v) => ({
          ...v,
          prices: undefined,
        })),
      }))
    )

    const createdProducts = createProductsStep(productWithoutPrices)

    // Note: We rely on the same order of input and output when creating products here, ensure this always holds true
    const variantsWithAssociatedPrices = transform(
      { input, createdProducts },
      (data) => {
        return data.createdProducts
          .map((p, i) => {
            const inputProduct = data.input.products[i]
            return p.variants?.map((v, j) => ({
              id: v.id,
              prices: inputProduct?.variants?.[j]?.prices,
            }))
          })
          .flat()
          .filter((v) => !!v.prices?.length)
      }
    )

    const createdPriceSets = createPriceSetsStep(variantsWithAssociatedPrices)

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

    // TODO: Should we just refetch the products here?
    return transform(
      {
        createdProducts,
        variantAndPriceSets,
      },
      (data) => {
        return data.createdProducts.map((product) => ({
          ...product,
          variants: product.variants?.map((variant) => ({
            ...variant,
            price_set: data.variantAndPriceSets.find(
              (v) => v.variant.id === variant.id
            )?.price_set,
          })),
        }))
      }
    )
  }
)
