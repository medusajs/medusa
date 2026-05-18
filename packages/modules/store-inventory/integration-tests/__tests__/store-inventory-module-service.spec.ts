import { IStoreInventoryModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { StoreInventoryModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { createStoreInventoryFixture } from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IStoreInventoryModuleService>({
  moduleName: Modules.STORE_INVENTORY,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.STORE_INVENTORY, {
        service: StoreInventoryModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["storeInventory"])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.storeInventory).toEqual({
        id: {
          linkable: "store_inventory_id",
          entity: "StoreInventory",
          primaryKey: "id",
          serviceName: "store_inventory",
          field: "storeInventory",
        },
      })
    })

    describe("Store Inventory Module Service", () => {
      const materialId = "bm_test_001"

      describe("creating store inventories", () => {
        it("should create a store inventory successfully", async function () {
          const inventory = await service.createStoreInventories(
            createStoreInventoryFixture(materialId)
          )

          expect(inventory).toEqual(
            expect.objectContaining({
              location_id: "store_001",
              material_id: materialId,
              online_stock: 100,
              online_reserved: 10,
              share_stock: 50,
              store_mode: "normal",
            })
          )
        })

        it("should create multiple inventories", async function () {
          const inventories = await service.createStoreInventories([
            createStoreInventoryFixture(materialId),
            {
              location_id: "store_002",
              material_id: materialId,
              online_stock: 200,
              store_mode: "discount",
            },
          ])

          expect(inventories).toHaveLength(2)
          expect(inventories[0].location_id).toEqual("store_001")
          expect(inventories[1].location_id).toEqual("store_002")
        })
      })

      describe("retrieving store inventories", () => {
        it("should retrieve an inventory by id", async function () {
          const created = await service.createStoreInventories(
            createStoreInventoryFixture(materialId)
          )
          const inventory = await service.retrieveStoreInventory(created.id)

          expect(inventory.id).toEqual(created.id)
          expect(inventory.online_stock).toEqual(100)
        })
      })

      describe("listing store inventories", () => {
        it("should list all inventories", async function () {
          await service.createStoreInventories([
            createStoreInventoryFixture(materialId),
            {
              location_id: "store_002",
              material_id: materialId,
              online_stock: 200,
            },
          ])

          const inventories = await service.listStoreInventories()
          expect(inventories).toHaveLength(2)
        })

        it("should list and count inventories", async function () {
          await service.createStoreInventories([
            createStoreInventoryFixture(materialId),
            {
              location_id: "store_002",
              material_id: materialId,
              online_stock: 200,
            },
          ])

          const [inventories, count] = await service.listAndCountStoreInventories()
          expect(inventories).toHaveLength(2)
          expect(count).toEqual(2)
        })

        it("should filter by location_id", async function () {
          await service.createStoreInventories([
            createStoreInventoryFixture(materialId),
            {
              location_id: "store_002",
              material_id: materialId,
              online_stock: 200,
            },
          ])

          const inventories = await service.listStoreInventories({
            location_id: "store_002",
          })
          expect(inventories).toHaveLength(1)
          expect(inventories[0].online_stock).toEqual(200)
        })
      })

      describe("updating store inventories", () => {
        it("should update stock quantities", async function () {
          const created = await service.createStoreInventories(
            createStoreInventoryFixture(materialId)
          )
          const updated = await service.updateStoreInventories({
            id: created.id,
            online_stock: 150,
            online_reserved: 20,
          })

          expect(updated.online_stock).toEqual(150)
          expect(updated.online_reserved).toEqual(20)
        })
      })

      describe("deleting store inventories", () => {
        it("should delete an inventory", async function () {
          const created = await service.createStoreInventories(
            createStoreInventoryFixture(materialId)
          )
          await service.deleteStoreInventories(created.id)

          const inventories = await service.listStoreInventories()
          expect(inventories).toHaveLength(0)
        })
      })
    })
  },
})
