import { CartDTO } from "@medusajs/framework/types";

export type PluginCartDTO = CartDTO & {
  gift_cards: {
    code: string;
  }[];
};
