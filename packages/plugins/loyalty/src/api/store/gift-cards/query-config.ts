import { buildAllowedFields } from "@medusajs/medusa/api/store/utils/allowed-fields";
import { storeCreditAccountScalarFields } from "../store-credit-accounts/query-config";

export const giftCardFields = [
  "id",
  "status",
  "code",
  "value",
  "currency_code",
  "expires_at",
  "note",
  "updated_at",
  "created_at",
];

export const giftCardScalarFields = [
  ...giftCardFields,
  "reference",
  "reference_id",
  "line_item_id",
  "metadata",
];

const storeCreditAccountRelationFields = [
  "store_credit_account",
  ...storeCreditAccountScalarFields.map(
    (field) => `store_credit_account.${field}`
  ),
];

const lineItemScalarFields = [
  "id",
  "title",
  "subtitle",
  "thumbnail",
  "variant_id",
  "product_id",
  "product_title",
  "product_description",
  "product_subtitle",
  "product_type_id",
  "product_type",
  "product_collection",
  "product_handle",
  "variant_sku",
  "variant_barcode",
  "variant_title",
  "variant_option_values",
  "requires_shipping",
  "is_discountable",
  "is_tax_inclusive",
  "unit_price",
  "quantity",
  "created_at",
  "updated_at",
];

const lineItemRelationFields = [
  "line_item",
  ...lineItemScalarFields.map((field) => `line_item.${field}`),
];

export const giftCardAllowedFields = buildAllowedFields(
  giftCardScalarFields,
  storeCreditAccountRelationFields,
  lineItemRelationFields
);

export const giftCardRelationAllowedFields = [
  "gift_cards",
  ...giftCardAllowedFields.map((field) => `gift_cards.${field}`),
];

export const retrieveGiftCardTransformQueryConfig = {
  defaults: giftCardFields,
  allowed: giftCardAllowedFields,
  isList: false,
};

export const listGiftCardsTransformQueryConfig = {
  defaults: giftCardFields,
  allowed: giftCardAllowedFields,
  isList: true,
};
