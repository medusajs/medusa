export const formatAmount = (amount: number, currency_code: string) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency_code,
  }).format(amount);
};
