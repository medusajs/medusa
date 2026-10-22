import { buildAllowedFields } from "@medusajs/medusa/api/store/utils/allowed-fields";

export const storeCreditAccountFields = [
  "id",
  "currency_code",
  "customer_id",
  "*customer",
  "credits",
  "debits",
  "balance",
  "updated_at",
  "created_at",
  "metadata",
];

export const storeCreditAccountScalarFields = [
  "id",
  "code",
  "currency_code",
  "customer_id",
  "credits",
  "debits",
  "balance",
  "updated_at",
  "created_at",
  "metadata",
];

export const accountTransactionScalarFields = [
  "id",
  "amount",
  "type",
  "reference",
  "reference_id",
  "note",
  "metadata",
  "updated_at",
  "created_at",
];

export const storeCreditAccountAllowedFields = buildAllowedFields(
  storeCreditAccountFields,
  storeCreditAccountScalarFields,
  ["transactions"],
  accountTransactionScalarFields.map((field) => `transactions.${field}`)
);

export const retrieveStoreCreditAccountTransformQueryConfig = {
  defaults: storeCreditAccountFields,
  allowed: storeCreditAccountAllowedFields,
  isList: false,
};

export const listStoreCreditAccountsTransformQueryConfig = {
  defaults: storeCreditAccountFields,
  allowed: storeCreditAccountAllowedFields,
  isList: true,
};
