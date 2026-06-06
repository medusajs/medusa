import { defineLink } from "@zjedene-medusa/framework/utils";
import CartModule from "@zjedene-medusa/medusa/cart";
import LoyaltyModule from "../modules/loyalty";

export default defineLink(
  { linkable: CartModule.linkable.cart, isList: true },
  {
    linkable: LoyaltyModule.linkable.giftCard,
    isList: true,
  }
);
