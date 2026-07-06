export const storeCreditAccountFields = [
  "id",
  "currency_code",
  "customer_id",
  "code",
  "*customer",
  "credits",
  "debits",
  "balance",
  "updated_at",
  "created_at",
  "metadata",
];

export const retrieveStoreCreditAccountTransformQueryConfig = {
  defaults: storeCreditAccountFields,
  isList: false,
};

export const listStoreCreditAccountsTransformQueryConfig = {
  defaults: storeCreditAccountFields,
  isList: true,
};

export const storeCreditAccountTransactionsFields = [
  "id",
  "amount",
  "type",
  "reference",
  "reference_id",
  "note",
  "updated_at",
  "created_at",
  "metadata",
];

export const retrieveStoreCreditAccountTransactionsTransformQueryConfig = {
  defaults: storeCreditAccountTransactionsFields,
  isList: false,
};

export const listStoreCreditAccountTransactionsTransformQueryConfig = {
  defaults: storeCreditAccountTransactionsFields,
  isList: true,
};
