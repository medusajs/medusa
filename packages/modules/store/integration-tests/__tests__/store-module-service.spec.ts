import { IStoreModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { createStoreFixture } from "../__fixtures__"
import { Modules } from "@medusajs/utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IStoreModuleService>({
  moduleName: Modules.STORE,
  testSuite: ({ service }) => {
    describe("Store Module Service", () => {
      describe("creating a store", () => {
        it("should get created successfully", async function () {
          const store = await service.createStores(createStoreFixture)

          expect(store).toEqual(
            expect.objectContaining({
              name: "Test store",
              supported_currencies: expect.arrayContaining([
                expect.objectContaining({ currency_code: "eur" }),
                expect.objectContaining({ currency_code: "usd" }),
              ]),
              default_sales_channel_id: "test-sales-channel",
              default_region_id: "test-region",
              metadata: {
                test: "test",
              },
            })
          )
        })

        it("should fail to get created if there is no default currency", async function () {
          const err = await service
            .createStores({
              ...createStoreFixture,
              supported_currencies: [{ currency_code: "usd" }],
            })
            .catch((err) => err.message)

          expect(err).toEqual(
            "There should be a default currency set for the store"
          )
        })
      })

      describe("upserting a store", () => {
        it("should get created if it does not exist", async function () {
          const store = await service.upsertStores(createStoreFixture)

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
          const createdStore = await service.upsertStores(createStoreFixture)
          const upsertedStore = await service.upsertStores({
            name: "Upserted store",
          })

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
          const createdStore = await service.createStores(createStoreFixture)
          const updatedStore = await service.updateStores(createdStore.id, {
            name: "Updated store",
          })
          expect(updatedStore.name).toEqual("Updated store")
        })

        it("should fail updating currencies without a default one", async function () {
          const createdStore = await service.createStores(createStoreFixture)
          const updateErr = await service
            .updateStores(createdStore.id, {
              supported_currencies: [{ currency_code: "usd" }],
            })
            .catch((err) => err.message)

          expect(updateErr).toEqual(
            "There should be a default currency set for the store"
          )
        })

        it("should fail updating currencies where a duplicate currency code exists", async function () {
          const createdStore = await service.createStores(createStoreFixture)
          const updateErr = await service
            .updateStores(createdStore.id, {
              supported_currencies: [
                { currency_code: "usd" },
                { currency_code: "usd" },
              ],
            })
            .catch((err) => err.message)

          expect(updateErr).toEqual("Duplicate currency codes: usd")
        })

        it("should fail updating currencies where there is more than 1 default currency", async function () {
          const createdStore = await service.createStores(createStoreFixture)
          const updateErr = await service
            .updateStores(createdStore.id, {
              supported_currencies: [
                { currency_code: "usd", is_default: true },
                { currency_code: "eur", is_default: true },
              ],
            })
            .catch((err) => err.message)

          expect(updateErr).toEqual("Only one default currency is allowed")
        })
      })

      describe("deleting a store", () => {
        it("should successfully delete existing stores", async function () {
          const createdStore = await service.createStores([
            createStoreFixture,
            createStoreFixture,
          ])

          await service.deleteStores([createdStore[0].id, createdStore[1].id])

          const storeInDatabase = await service.listStores()
          expect(storeInDatabase).toHaveLength(0)
        })
      })

      describe("retrieving a store", () => {
        it("should successfully return all existing stores", async function () {
          await service.createStores([
            createStoreFixture,
            { ...createStoreFixture, name: "Another store" },
          ])

          const storesInDatabase = await service.listStores()
          expect(storesInDatabase).toHaveLength(2)
          expect(storesInDatabase.map((s) => s.name)).toEqual(
            expect.arrayContaining(["Test store", "Another store"])
          )
        })
      })
    })
  },
})
