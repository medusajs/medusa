import { IPlatformMappingModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { PlatformMappingModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createPlatformSkuFixture,
  createPlatformSyncTaskFixture,
} from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IPlatformMappingModuleService>({
  moduleName: Modules.PLATFORM_MAPPING,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.PLATFORM_MAPPING, {
        service: PlatformMappingModuleService,
      }).linkable

      expect(Object.keys(linkable).sort()).toEqual([
        "platformSku",
        "platformSyncTask",
      ])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.platformSku).toEqual({
        id: {
          linkable: "platform_sku_id",
          entity: "PlatformSku",
          primaryKey: "id",
          serviceName: "platform_mapping",
          field: "platformSku",
        },
      })
    })

    describe("Platform Mapping Module Service", () => {
      const shopId = "shop_test_001"

      describe("PlatformSku", () => {
        describe("creating", () => {
          it("should create a platform sku", async function () {
            const sku = await service.createPlatformSkus(
              createPlatformSkuFixture(shopId)
            )

            expect(sku).toEqual(
              expect.objectContaining({
                shop_id: shopId,
                platform_type: "taobao",
                platform_product_id: "123456789",
                platform_sku_code: "TEST001",
                mapping_status: "mapped",
                listing_status: "listed",
              })
            )
          })

          it("should create multiple skus", async function () {
            const skus = await service.createPlatformSkus([
              createPlatformSkuFixture(shopId),
              {
                ...createPlatformSkuFixture(shopId),
                platform_product_id: "987654321",
                platform_sku_code: "TEST002",
                platform_type: "douyin",
              },
            ])

            expect(skus).toHaveLength(2)
            expect(skus[0].platform_type).toEqual("taobao")
            expect(skus[1].platform_type).toEqual("douyin")
          })
        })

        describe("retrieving", () => {
          it("should retrieve by id", async function () {
            const created = await service.createPlatformSkus(
              createPlatformSkuFixture(shopId)
            )
            const sku = await service.retrievePlatformSku(created.id)
            expect(sku.platform_sku_code).toEqual("TEST001")
          })
        })

        describe("listing", () => {
          it("should list and count", async function () {
            await service.createPlatformSkus([
              createPlatformSkuFixture(shopId),
              {
                ...createPlatformSkuFixture(shopId),
                platform_product_id: "987654321",
                platform_type: "douyin",
              },
            ])

            const [skus, count] = await service.listAndCountPlatformSkus()
            expect(skus).toHaveLength(2)
            expect(count).toEqual(2)
          })

          it("should filter by listing_status", async function () {
            await service.createPlatformSkus([
              createPlatformSkuFixture(shopId),
              {
                ...createPlatformSkuFixture(shopId),
                platform_product_id: "987654321",
                platform_sku_id: "SKU456",
                listing_status: "delisted",
              },
            ])

            const skus = await service.listPlatformSkus({
              listing_status: "delisted",
            })
            expect(skus).toHaveLength(1)
          })
        })

        describe("updating", () => {
          it("should update platform price", async function () {
            const created = await service.createPlatformSkus(
              createPlatformSkuFixture(shopId)
            )
            const updated = await service.updatePlatformSkus({
              id: created.id,
              platform_price: 129.99,
            })
            expect(updated.platform_price).toEqual(129.99)
          })
        })

        describe("deleting", () => {
          it("should delete a platform sku", async function () {
            const created = await service.createPlatformSkus(
              createPlatformSkuFixture(shopId)
            )
            await service.deletePlatformSkus(created.id)
            const skus = await service.listPlatformSkus()
            expect(skus).toHaveLength(0)
          })
        })
      })

      describe("PlatformSyncTask", () => {
        describe("creating", () => {
          it("should create a sync task", async function () {
            const task = await service.createPlatformSyncTasks(
              createPlatformSyncTaskFixture(shopId)
            )

            expect(task).toEqual(
              expect.objectContaining({
                shop_id: shopId,
                platform_type: "taobao",
                action: "create",
                status: "success",
              })
            )
          })
        })

        describe("listing", () => {
          it("should list and count", async function () {
            await service.createPlatformSyncTasks([
              createPlatformSyncTaskFixture(shopId),
              {
                ...createPlatformSyncTaskFixture(shopId),
                action: "update",
                status: "pending",
              },
            ])

            const [tasks, count] =
              await service.listAndCountPlatformSyncTasks()
            expect(tasks).toHaveLength(2)
            expect(count).toEqual(2)
          })

          it("should filter by status", async function () {
            await service.createPlatformSyncTasks([
              createPlatformSyncTaskFixture(shopId),
              {
                ...createPlatformSyncTaskFixture(shopId),
                action: "update",
                status: "failed",
              },
            ])

            const tasks = await service.listPlatformSyncTasks({
              status: "failed",
            })
            expect(tasks).toHaveLength(1)
            expect(tasks[0].action).toEqual("update")
          })
        })

        describe("updating", () => {
          it("should update status", async function () {
            const created = await service.createPlatformSyncTasks(
              createPlatformSyncTaskFixture(shopId)
            )
            const updated = await service.updatePlatformSyncTasks({
              id: created.id,
              status: "failed",
              error_msg: "API timeout",
            })
            expect(updated.status).toEqual("failed")
            expect(updated.error_msg).toEqual("API timeout")
          })
        })

        describe("deleting", () => {
          it("should delete a sync task", async function () {
            const created = await service.createPlatformSyncTasks(
              createPlatformSyncTaskFixture(shopId)
            )
            await service.deletePlatformSyncTasks(created.id)
            const tasks = await service.listPlatformSyncTasks()
            expect(tasks).toHaveLength(0)
          })
        })
      })
    })
  },
})
