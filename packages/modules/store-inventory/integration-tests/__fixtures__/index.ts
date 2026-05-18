export const createStoreInventoryFixture = (materialId: string) => ({
  location_id: "store_001",
  material_id: materialId,
  online_stock: 100,
  online_reserved: 10,
  share_stock: 50,
  share_reserved: 5,
  in_transit_stock: 20,
  store_mode: "normal" as const,
})
