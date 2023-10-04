const catalogIds = {
  id1: "catalog_1",
  id2: "catalog_2",
  id3: "catalog_3",
  id4: "catalog_4",
  id5: "catalog_5",
  id6: "catalog_6",
  id7: "catalog_7",
  id8: "catalog_8",
}

const productData1 = [
  {
    id: catalogIds.id1,
    entity: "Product",
    data: {
      id: "prod_1",
      title: "title",
      description: "desc",
    },
  },
  {
    id: catalogIds.id2,
    entity: "ProductVariant",
    parent_ids: [catalogIds.id1],
    data: {
      id: "pv_1",
      title: "title",
      sku: "sku_1",
    },
  },
  {
    id: catalogIds.id3,
    entity: "MoneyAmount",
    parent_ids: [catalogIds.id2],
    data: {
      id: "ma_1",
      amount: 150,
      currency_code: "usd",
      region_id: "reg_1",
    },
  },
  {
    id: catalogIds.id4,
    entity: "MoneyAmount",
    parent_ids: [catalogIds.id2],
    data: {
      id: "ma_2",
      amount: 300,
      currency_code: "eur",
      region_id: "reg_2",
    },
  },
]

const productData2 = [
  {
    id: catalogIds.id5,
    entity: "Product",
    data: {
      id: "prod_2",
      title: "title_another",
      description: "desc_another",
    },
  },
  {
    id: catalogIds.id6,
    entity: "ProductVariant",
    parent_ids: [catalogIds.id5],
    data: {
      id: "pv_2",
      title: "title_2",
      sku: "sku_2",
    },
  },
  {
    id: catalogIds.id7,
    entity: "MoneyAmount",
    parent_ids: [catalogIds.id6],
    data: {
      id: "ma_3",
      amount: 10,
      currency_code: "eur",
      region_id: "reg_3",
    },
  },
  {
    id: catalogIds.id8,
    entity: "MoneyAmount",
    parent_ids: [catalogIds.id6],
    data: {
      id: "ma_4",
      amount: 30,
      currency_code: "eur",
      region_id: "reg_4",
    },
  },
]

export const catalogData: any[] = [...productData1, ...productData2]
