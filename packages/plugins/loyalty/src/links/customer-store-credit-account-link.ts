import { defineLink } from "@zjedene-medusa/framework/utils";
import CustomerModule from "@zjedene-medusa/medusa/customer";
import StoreCreditModule from "../modules/store-credit";

defineLink(
  {
    linkable: StoreCreditModule.linkable.storeCreditAccount,
    field: "customer_id",
  },
  CustomerModule.linkable.customer,
  { readOnly: true, isList: false }
);
