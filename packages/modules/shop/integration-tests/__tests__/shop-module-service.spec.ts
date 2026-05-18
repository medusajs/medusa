import { IShopModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { ShopModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { createShopFixture, createDouyinShopFixture } from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IShopModuleService>({
  moduleName: Modules.SHOP,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.SHOP, {
        service: ShopModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["shop"])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.shop).toEqual({
        id: {
          linkable: "shop_id",
          entity: "Shop",
          primaryKey: "id",
          serviceName: "shop",
          field: "shop",
        },
      })
    })

    describe("Shop Module Service", () => {
      describe("creating shops", () => {
        it("should create a shop successfully", async function () {
          const shop = await service.createShops(createShopFixture)

          expect(shop).toEqual(
            expect.objectContaining({
              shop_code: "TAOBAO_001",
              shop_name: "Test Taobao Shop",
              platform_type: "taobao",
              status: "active",
            })
          )
        })

        it("should create multiple shops", async function () {
          const shops = await service.createShops([
            createShopFixture,
            createDouyinShopFixture,
          ])

          expect(shops).toHaveLength(2)
          expect(shops[0].platform_type).toEqual("taobao")
          expect(shops[1].platform_type).toEqual("douyin")
        })
      })

      describe("retrieving shops", () => {
        it("should retrieve a shop by id", async function () {
          const created = await service.createShops(createShopFixture)
          const shop = await service.retrieveShop(created.id)

          expect(shop.id).toEqual(created.id)
          expect(shop.shop_code).toEqual("TAOBAO_001")
        })
      })

      describe("listing shops", () => {
        it("should list all shops", async function () {
          await service.createShops([
            createShopFixture,
            createDouyinShopFixture,
          ])

          const shops = await service.listShops()
          expect(shops).toHaveLength(2)
        })

        it("should list and count shops", async function () {
          await service.createShops([
            createShopFixture,
            createDouyinShopFixture,
          ])

          const [shops, count] = await service.listAndCountShops()
          expect(shops).toHaveLength(2)
          expect(count).toEqual(2)
        })

        it("should filter by platform_type", async function () {
          await service.createShops([
            createShopFixture,
            createDouyinShopFixture,
          ])

          const shops = await service.listShops({ platform_type: "douyin" })
          expect(shops).toHaveLength(1)
          expect(shops[0].shop_name).toEqual("Test Douyin Shop")
        })
      })

      describe("updating shops", () => {
        it("should update a shop name", async function () {
          const created = await service.createShops(createShopFixture)
          const updated = await service.updateShops({
            id: created.id,
            shop_name: "Updated Shop",
          })

          expect(updated.shop_name).toEqual("Updated Shop")
          expect(updated.shop_code).toEqual("TAOBAO_001")
        })
      })

      describe("deleting shops", () => {
        it("should delete a shop", async function () {
          const created = await service.createShops(createShopFixture)
          await service.deleteShops(created.id)

          const shops = await service.listShops()
          expect(shops).toHaveLength(0)
        })
      })
    })
  },
})
