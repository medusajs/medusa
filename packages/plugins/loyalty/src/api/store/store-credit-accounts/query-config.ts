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

export const retrieveStoreCreditAccountTransformQueryConfig = {
  defaults: storeCreditAccountFields,
  isList: false,
};

export const listStoreCreditAccountsTransformQueryConfig = {
  defaults: storeCreditAccountFields,
  isList: true,
};
