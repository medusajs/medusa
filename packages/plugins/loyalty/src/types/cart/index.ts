import { CartDTO } from "@medusajs/framework/types";

export type PluginCartDTO = CartDTO & {
  /**
   * The gift cards applied to the cart.
   */
  gift_cards: {
    /**
     * The code of the gift card applied to the cart.
     */
    code: string;
  }[];
};
