import { Modules } from "@medusajs/modules-sdk"
import { IStoreModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { createStoreFixture } from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.STORE,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IStoreModuleService>) => {
    describe("Store Module Service", () => {
      describe("creating a store", () => {
        it("should get created successfully", async function () {
          const store = await service.create(createStoreFixture)

          expect(store).toEqual(
            expect.objectContaining({
              name: "Test store",
              supported_currency_codes: expect.arrayContaining(["eur", "usd"]),
              default_sales_channel_id: "test-sales-channel",
              default_region_id: "test-region",
              metadata: {
                test: "test",
              },
            })
          )
        })
      })

      describe("upserting a store", () => {
        it("should get created if it does not exist", async function () {
          const store = await service.upsert(createStoreFixture)

          expect(store).toEqual(
            expect.objectContaining({
              name: "Test store",
              default_sales_channel_id: "test-sales-channel",
              default_region_id: "test-region",
              metadata: {
                test: "test",
              },
            })
          )
        })

        it("should get created if it does not exist", async function () {
          const createdStore = await service.upsert(createStoreFixture)
          const upsertedStore = await service.upsert({ name: "Upserted store" })

          expect(upsertedStore).toEqual(
            expect.objectContaining({
              name: "Upserted store",
            })
          )
          expect(upsertedStore.id).not.toEqual(createdStore.id)
        })
      })

      describe("updating a store", () => {
        it("should update the name successfully", async function () {
          const createdStore = await service.create(createStoreFixture)
          const updatedStore = await service.update(createdStore.id, {
            title: "Updated store",
          })
          expect(updatedStore.title).toEqual("Updated store")
        })
      })

      describe("deleting a store", () => {
        it("should successfully delete existing stores", async function () {
          const createdStore = await service.create([
            createStoreFixture,
            createStoreFixture,
          ])

          await service.delete([createdStore[0].id, createdStore[1].id])

          const storeInDatabase = await service.list()
          expect(storeInDatabase).toHaveLength(0)
        })
      })

      describe("retrieving a store", () => {
        it("should successfully return all existing stores", async function () {
          await service.create([
            createStoreFixture,
            { ...createStoreFixture, name: "Another store" },
          ])

          const storesInDatabase = await service.list()
          expect(storesInDatabase).toHaveLength(2)
          expect(storesInDatabase.map((s) => s.name)).toEqual(
            expect.arrayContaining(["Test store", "Another store"])
          )
        })
      })
    })
  },
})
