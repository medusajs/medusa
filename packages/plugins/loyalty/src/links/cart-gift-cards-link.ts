import { defineLink } from "@medusajs/framework/utils";
import CartModule from "@medusajs/medusa/cart";
import LoyaltyModule from "../modules/loyalty";

export default defineLink(
  { linkable: CartModule.linkable.cart, isList: true },
  {
    linkable: LoyaltyModule.linkable.giftCard,
    isList: true,
  }
);
