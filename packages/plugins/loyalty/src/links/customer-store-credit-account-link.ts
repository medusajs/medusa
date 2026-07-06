import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import StoreCreditModule from "../modules/store-credit";

defineLink(
  {
    linkable: StoreCreditModule.linkable.storeCreditAccount,
    field: "customer_id",
  },
  CustomerModule.linkable.customer,
  { readOnly: true, isList: false }
);
