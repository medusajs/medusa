import {
  defaultStoreCartFields,
  retrieveTransformQueryConfig as storeCartRetrieveTransformQueryConfig,
} from "@medusajs/medusa/api/store/carts/query-config";
import {
  giftCardRelationAllowedFields,
  giftCardRelationDefaultFields,
} from "../gift-cards/query-config";

export const retrieveTransformQueryConfig = {
  defaults: [...defaultStoreCartFields, ...giftCardRelationDefaultFields],
  allowed: [
    ...(storeCartRetrieveTransformQueryConfig.allowed ?? []),
    ...giftCardRelationAllowedFields,
  ],
  isList: false,
};
