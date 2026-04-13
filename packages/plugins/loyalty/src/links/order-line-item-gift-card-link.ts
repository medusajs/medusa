import { defineLink } from "@medusajs/framework/utils";
import LoyaltyModule from "../modules/loyalty";

defineLink(
  {
    linkable: LoyaltyModule.linkable.giftCard,
    field: "line_item_id",
  },
  {
    serviceName: "order",
    entity: "OrderLineItem",
    alias: "line_item",
    field: "id",
    linkable: "OrderLineItem",
    primaryKey: "id",
  },
  { readOnly: true, isList: false }
);
