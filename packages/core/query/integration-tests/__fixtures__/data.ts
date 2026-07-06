export const integrationData = {
  products: [
    {
      id: "prod_1",
      title: "T-Shirt",
      handle: "t-shirt",
    },
    {
      id: "prod_2",
      title: "Hoodie",
      handle: "hoodie",
    },
  ],
  variants: [
    {
      id: "variant_1",
      product_id: "prod_1",
      sku: "TS-SM",
    },
    {
      id: "variant_2",
      product_id: "prod_1",
      sku: "TS-LG",
    },
    {
      id: "variant_3",
      product_id: "prod_2",
      sku: "HD-OS",
    },
  ],
  priceSets: [
    {
      id: "pset_1",
    },
    {
      id: "pset_2",
    },
    {
      id: "pset_3",
    },
  ],
  prices: [
    {
      id: "price_1",
      amount: 1000,
      currency_code: "usd",
      price_set_id: "pset_1",
    },
    {
      id: "price_2",
      amount: 1500,
      currency_code: "usd",
      price_set_id: "pset_2",
    },
    {
      id: "price_3",
      amount: 4500,
      currency_code: "usd",
      price_set_id: "pset_3",
    },
  ],
  variantPriceSetLinks: [
    {
      id: "link_1",
      variant_id: "variant_1",
      price_set_id: "pset_1",
    },
    {
      id: "link_2",
      variant_id: "variant_2",
      price_set_id: "pset_2",
    },
    {
      id: "link_3",
      variant_id: "variant_3",
      price_set_id: "pset_3",
    },
  ],
}
