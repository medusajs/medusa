import { PricingTypes, ProductTypes } from "../../bundles"

/**
 * The details of the variant to create.
 */
export type CreateProductVariantWorkflowInputDTO =
  ProductTypes.CreateProductVariantDTO & {
    /**
     * The variant's prices.
     */
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  }

/**
 * The details of the variant to update.
 */
export type UpdateProductVariantWorkflowInputDTO =
  ProductTypes.UpsertProductVariantDTO & {
    /**
     * The variant's prices.
     */
    prices?: PricingTypes.UpsertMoneyAmountDTO[]
  }

/**
 * The details of the product to create.
 */
export type CreateProductWorkflowInputDTO = Omit<
  ProductTypes.CreateProductDTO,
  "variants"
> & {
  /**
   * The sales channels that the product is available in.
   */
  sales_channels?: { id: string }[]
  /**
   * The product's shipping profile.
   */
  shipping_profile_id?: string
  /**
   * The product's variants.
   */
  variants?: CreateProductVariantWorkflowInputDTO[]
}

export type UpdateProductWorkflowInputDTO = ProductTypes.UpsertProductDTO & {
  sales_channels?: { id: string }[]
  shipping_profile_id?: string | null
}
