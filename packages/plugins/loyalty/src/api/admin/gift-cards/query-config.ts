export const giftCardFields = [
  "id",
  "status",
  "code",
  "value",
  "currency_code",
  "line_item_id",
  "reference_id",
  "reference",
  "expires_at",
  "note",
  "updated_at",
  "created_at",
  "metadata",
];

export const giftCardOrderFields = ["id", "display_id", "version", "status"];

export const retrieveGiftCardTransformQueryConfig = {
  defaults: giftCardFields,
  isList: false,
};

export const listGiftCardsTransformQueryConfig = {
  defaults: giftCardFields,
  isList: true,
};

export const retrieveGiftCardOrdersTransformQueryConfig = {
  defaults: giftCardOrderFields,
  isList: false,
};
