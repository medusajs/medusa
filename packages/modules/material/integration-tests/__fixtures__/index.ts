export const createBasicMaterialFixture = {
  material_code: "BM001",
  material_name: "Test T-Shirt",
  spu_code: "SPU001",
  material_type: "finished" as const,
  sn_managed: false,
  stock_controlled: true,
}

export const createSalesMaterialFixture = (shopId: string, materialId?: string) => ({
  shop_id: shopId,
  sales_code: "SM001",
  sales_name: "Test Sales Material",
  sales_type: "normal" as const,
  basic_material_id: materialId,
  is_bound: true,
  status: "active" as const,
})

export const createComboItemFixture = (parentId: string, childId: string) => ({
  parent_material_id: parentId,
  child_material_id: childId,
  quantity: 2,
  is_optional: false,
  sort_order: 1,
})
