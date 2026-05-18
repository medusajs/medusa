export const createChannelPriceFixture = (salesMaterialId: string) => ({
  sales_material_id: salesMaterialId,
  price_type: "retail" as const,
  currency_code: "CNY",
  amount: 99.99,
  min_quantity: 1,
  max_quantity: 100,
})

export const createWholesalePriceFixture = (salesMaterialId: string) => ({
  sales_material_id: salesMaterialId,
  price_type: "wholesale" as const,
  currency_code: "CNY",
  amount: 79.99,
  min_quantity: 50,
  max_quantity: 500,
})
