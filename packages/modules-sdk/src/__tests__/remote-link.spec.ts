import { InventoryModule } from "../__mocks__/inventory-module"
import { InventoryStockLocationLink } from "../__mocks__/inventory-stock-location-link"
import { ProductInventoryLinkModule } from "../__mocks__/product-inventory-link"
import { ProductModule } from "../__mocks__/product-module"
import { StockLocationModule } from "../__mocks__/stock-location-module"

import { RemoteLink } from "../remote-link"

const allModules = [
  // modules
  ProductModule,
  InventoryModule,
  StockLocationModule,
  // links
  ProductInventoryLinkModule,
  InventoryStockLocationLink,
]
describe("Remote Link", function () {
  it("Should get all loaded modules and compose their relationships", async function () {
    const remoteLink = new RemoteLink(allModules as any)

    const relations = remoteLink.getRelationships()

    const prodInventoryLink = relations.get(
      "productVariantInventoryInventoryItemLink"
    )
    const prodModule = relations.get("productService")
    const inventoryModule = relations.get("inventoryService")

    expect(prodInventoryLink?.get("variant_id")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          serviceName: "productService",
          primaryKey: "id",
          foreignKey: "variant_id",
          alias: "variant",
          deleteCascade: true,
          isPrimary: false,
          isForeign: true,
        }),
      ])
    )

    expect(prodInventoryLink?.get("inventory_item_id")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          serviceName: "inventoryService",
          primaryKey: "id",
          foreignKey: "inventory_item_id",
          alias: "inventory",
          deleteCascade: true,
          isPrimary: false,
          isForeign: true,
        }),
      ])
    )

    expect(prodModule?.get("variant_id")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          serviceName: "productVariantInventoryInventoryItemLink",
          primaryKey: "variant_id",
          foreignKey: "id",
          alias: "inventory_items",
          isList: true,
          isPrimary: true,
          isForeign: false,
        }),
      ])
    )

    expect(inventoryModule?.get("inventory_item_id")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          serviceName: "productVariantInventoryInventoryItemLink",
          primaryKey: "inventory_item_id",
          foreignKey: "id",
          alias: "variant_link",
          isPrimary: true,
          isForeign: false,
        }),
      ])
    )
  })

  it.only("Should call the correct link module to create relation between 2 keys", async function () {
    const remoteLink = new RemoteLink(allModules as any)

    await remoteLink.create([
      {
        productService: {
          variant_id: "prod_123",
        },
        inventoryService: {
          inventory_item_id: "inv_123",
        },
      },
      {
        productService: {
          variant_id: "prod_abc",
        },
        inventoryService: {
          inventory_item_id: "inv_abc",
        },
      },
      {
        inventoryService: {
          inventory_item_id: "inv_abc",
        },
        stockLocationService: {
          stock_location_id: "loc_123",
        },
      },
    ])

    expect(ProductInventoryLinkModule.create).toBeCalledWith([
      ["prod_123", "inv_123"],
      ["prod_abc", "inv_abc"],
    ])
    expect(InventoryStockLocationLink.create).toBeCalledWith([
      ["inv_abc", "loc_123"],
    ])
  })
})
