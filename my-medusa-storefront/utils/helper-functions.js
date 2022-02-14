export const quantity = (item) => {
  return item.quantity;
};

export const sum = (prev, next) => {
  return prev + next;
};

export const formatPrice = (price, currency) => {
  return `${(price / 100).toFixed(2)} ${currency.toUpperCase()}`;
};

export const getSlug = (path) => {
  const tmp = path.split("/");
  return tmp[tmp.length - 1];
};

export const resetOptions = (product) => {
  const variantId = product.variants.slice(0).reverse()[0].id;
  const size = product.variants.slice(0).reverse()[0].title;
  return {
    variantId: variantId,
    quantity: 1,
    size: size,
  };
};

export const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;
