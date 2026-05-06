import { defineLink } from "@medusajs/framework/utils";
import LoyaltyModule from "../modules/loyalty";
import StoreCreditModule from "../modules/store-credit";

export default defineLink(
  { linkable: LoyaltyModule.linkable.giftCard, isList: true },
  StoreCreditModule.linkable.storeCreditAccount
);
