import { defaultStoreCartFields } from "@zjedene-medusa/medusa/api/store/carts/query-config";

export const retrieveTransformQueryConfig = {
  defaults: [...defaultStoreCartFields, "*gift_cards"],
  isList: false,
};
