import { defineLink } from "@zjedene-medusa/framework/utils";
import OrderModule from "@zjedene-medusa/medusa/order";
import LoyaltyModule from "../modules/loyalty";

export default defineLink(
  { linkable: OrderModule.linkable.order, isList: true },
  {
    linkable: LoyaltyModule.linkable.giftCard,
    isList: true,
  }
);
