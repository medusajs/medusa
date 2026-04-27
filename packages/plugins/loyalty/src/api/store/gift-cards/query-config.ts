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

export const retrieveGiftCardTransformQueryConfig = {
  defaults: giftCardFields,
  isList: false,
};

export const listGiftCardsTransformQueryConfig = {
  defaults: giftCardFields,
  isList: true,
};
