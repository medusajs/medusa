import { CartDTO, CartLineItemDTO } from "../.."

/**
 * A cart's details relevant for fulfillment.
 */
export type CartPropsForFulfillment = {
  /**
   * The cart's ID.
   */
  id: CartDTO["id"]
  /**
   * The cart's shipping address.
   */
  shipping_address: CartDTO["shipping_address"]
  /**
   * The cart's items
   */
  items: (CartLineItemDTO & {
    /**
     * The item's variant.
     */
    variant: {
      /**
       * The variant's ID.
       */
      id: string
      /**
       * The variant's weight.
       */
      weight: number
      /**
       * The variant's length.
       */
      length: number
      /**
       * The variant's height.
       */
      height: number
      /**
       * The variant's width.
       */
      width: number
      /**
       * The variant's material.
       */
      material: string
      /**
       * The variant's associated product.
       */
      product: {
        /**
         * The product's ID.
         */
        id: string
      }
    }
    /**
     * The item's product.
     */
    product: {
      /**
       * The product's ID.
       */
      id: string
      /**
       * The ID of the collection that the product belongs to.
       */
      collection_id: string
      /**
       * The product's categories.
       */
      categories: {
        /**
         * The category's ID.
         */
        id: string
      }[]
      /**
       * The product's tags.
       */
      tags: {
        /**
         * The tag's ID.
         */
        id: string
      }[]
    }
  })[]
}
