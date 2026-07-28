import {
  TestEventUtils,
  medusaIntegrationTestRunner,
} from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import { CommonEvents, Modules } from "@medusajs/utils"
import fs from "fs/promises"
import { csv2json } from "json-2-csv"
import os from "os"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const getCSVContents = async (filePath: string) => {
  const asLocalPath = filePath.replace("http://localhost:9000", os.tmpdir())
  const fileContent = await fs.readFile(asLocalPath, { encoding: "utf-8" })
  await fs.rm(path.dirname(asLocalPath), { recursive: true, force: true })

  return csv2json(fileContent)
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let stockLocation1
    let stockLocation2
    let inventoryItem1
    let inventoryItem2

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
    })

    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      stockLocation1 = (
        await api.post(
          `/admin/stock-locations`,
          { name: "Location 1" },
          adminHeaders
        )
      ).data.stock_location

      stockLocation2 = (
        await api.post(
          `/admin/stock-locations`,
          { name: "Location 2" },
          adminHeaders
        )
      ).data.stock_location

      inventoryItem1 = (
        await api.post(
          `/admin/inventory-items`,
          {
            sku: "SHIRT",
            title: "Shirt",
            location_levels: [
              {
                location_id: stockLocation1.id,
                stocked_quantity: 10,
                incoming_quantity: 5,
              },
              {
                location_id: stockLocation2.id,
                stocked_quantity: 20,
              },
            ],
          },
          adminHeaders
        )
      ).data.inventory_item

      inventoryItem2 = (
        await api.post(
          `/admin/inventory-items`,
          {
            sku: "PANTS",
            title: "Pants",
            location_levels: [
              {
                location_id: stockLocation2.id,
                stocked_quantity: 30,
              },
            ],
          },
          adminHeaders
        )
      ).data.inventory_item

      await dbUtils.snapshot()
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/inventory-items/export", () => {
      it("should export a csv file containing the inventory levels per location", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const exportRes = await api.post(
          "/admin/inventory-items/export",
          {},
          adminHeaders
        )

        const transactionId = exportRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Inventory export",
              description: "Inventory export completed successfully!",
              file: expect.objectContaining({
                url: expect.stringContaining("-inventory-item-exports.csv"),
                filename: expect.any(String),
                mimeType: "text/csv",
              }),
            }),
          })
        )

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        expect(exportedFileContents).toHaveLength(2)
        expect(
          Object.keys(exportedFileContents[0]).some((column) =>
            column.includes("Incoming Quantity")
          )
        ).toBe(false)
        expect(exportedFileContents).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "Item Id": inventoryItem1.id,
              "Item Sku": "SHIRT",
              "Item Title": "Shirt",
              "Item Stocked Quantity": 30,
              "Item Reserved Quantity": 0,
              "Location [Location 1] Stocked Quantity": 10,
              "Location [Location 1] Reserved Quantity": 0,
              "Location [Location 1] Available Quantity": 10,
              "Location [Location 2] Stocked Quantity": 20,
              "Location [Location 2] Reserved Quantity": 0,
              "Location [Location 2] Available Quantity": 20,
            }),
            expect.objectContaining({
              "Item Id": inventoryItem2.id,
              "Item Sku": "PANTS",
              "Item Title": "Pants",
              "Item Stocked Quantity": 30,
              "Item Reserved Quantity": 0,
              "Location [Location 1] Stocked Quantity": "",
              "Location [Location 1] Reserved Quantity": "",
              "Location [Location 1] Available Quantity": "",
              "Location [Location 2] Stocked Quantity": 30,
              "Location [Location 2] Reserved Quantity": 0,
              "Location [Location 2] Available Quantity": 30,
            }),
          ])
        )
      })

      it("should export a csv file filtered by specific inventory items", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const exportRes = await api.post(
          `/admin/inventory-items/export?id=${inventoryItem2.id}`,
          {},
          adminHeaders
        )

        const transactionId = exportRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        expect(exportedFileContents).toHaveLength(1)
        expect(exportedFileContents[0]).toEqual(
          expect.objectContaining({
            "Item Id": inventoryItem2.id,
            "Item Sku": "PANTS",
          })
        )
      })

      it("should export a csv file filtered by location", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
          eventBus
        )

        const exportRes = await api.post(
          `/admin/inventory-items/export?location_levels[location_id]=${stockLocation1.id}`,
          {},
          adminHeaders
        )

        const transactionId = exportRes.data.transaction_id
        expect(transactionId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)

        const exportedFileContents = await getCSVContents(
          notifications[0].data.file.url
        )

        expect(exportedFileContents).toHaveLength(1)
        expect(exportedFileContents[0]).toEqual(
          expect.objectContaining({
            "Item Id": inventoryItem1.id,
            "Item Sku": "SHIRT",
          })
        )
      })
    })
  },
})
