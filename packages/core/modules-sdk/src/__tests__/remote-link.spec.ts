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

  it("Should call the correct link module to create relation between 2 keys", async function () {
    const remoteLink = new RemoteLink(allModules as any)

    await remoteLink.create([
      {
        productService: {
          variant_id: "var_123",
        },
        inventoryService: {
          inventory_item_id: "inv_123",
        },
      },
      {
        productService: {
          variant_id: "var_abc",
        },
        inventoryService: {
          inventory_item_id: "inv_abc",
        },
      },
      {
        inventoryService: {
          inventory_level_id: "ilev_123",
        },
        stockLocationService: {
          stock_location_id: "loc_123",
        },
      },
    ])

    expect(ProductInventoryLinkModule.create).toBeCalledWith([
      ["var_123", "inv_123"],
      ["var_abc", "inv_abc"],
    ])
    expect(InventoryStockLocationLink.create).toBeCalledWith([
      ["ilev_123", "loc_123"],
    ])
  })

  it("Should call delete in cascade all the modules involved in the link", async function () {
    const remoteLink = new RemoteLink(allModules as any)

    ProductInventoryLinkModule.softDelete.mockImplementation(() => {
      return {
        variant_id: ["var_123"],
        inventory_item_id: ["inv_123"],
      }
    })

    ProductModule.softDelete.mockImplementation(() => {
      return {
        product_id: ["prod_123", "prod_abc"],
        variant_id: ["var_123", "var_abc"],
      }
    })

    InventoryModule.softDelete.mockImplementation(() => {
      return {
        inventory_item_id: ["inv_123"],
        inventory_level_id: ["ilev_123"],
      }
    })

    InventoryStockLocationLink.softDelete.mockImplementation(() => {
      return {
        inventory_level_id: ["ilev_123"],
        stock_location_id: ["loc_123"],
      }
    })

    await remoteLink.delete({
      productService: {
        variant_id: "var_123",
      },
    })

    expect(ProductInventoryLinkModule.softDelete).toBeCalledTimes(2)
    expect(ProductModule.softDelete).toBeCalledTimes(1)
    expect(InventoryModule.softDelete).toBeCalledTimes(1)
    expect(InventoryStockLocationLink.softDelete).toBeCalledTimes(1)

    expect(ProductInventoryLinkModule.softDelete).toHaveBeenNthCalledWith(
      1,
      { variant_id: ["var_123"] },
      { returnLinkableKeys: ["variant_id", "inventory_item_id"] }
    )

    expect(ProductInventoryLinkModule.softDelete).toHaveBeenNthCalledWith(
      2,
      { variant_id: ["var_abc"] },
      { returnLinkableKeys: ["variant_id", "inventory_item_id"] }
    )

    expect(ProductModule.softDelete).toBeCalledWith(
      { id: ["var_123"] },
      { returnLinkableKeys: ["product_id", "variant_id"] }
    )

    expect(InventoryModule.softDelete).toBeCalledWith(
      { id: ["inv_123"] },
      {
        returnLinkableKeys: [
          "inventory_item_id",
          "inventory_level_id",
          "reservation_item_id",
        ],
      }
    )

    expect(InventoryStockLocationLink.softDelete).toBeCalledWith(
      {
        inventory_level_id: ["ilev_123"],
      },
      { returnLinkableKeys: ["inventory_level_id", "stock_location_id"] }
    )
  })
})
