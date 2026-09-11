import { IEventBusModuleService } from "@medusajs/types"
import { CommonEvents, Modules } from "@medusajs/utils"
import os from "os"
import fs from "fs/promises"
import {
  TestEventUtils,
  medusaIntegrationTestRunner,
} from "@medusajs/test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { csv2json } from "json-2-csv"

jest.setTimeout(50000)

const readExportFile = async (filePath: string) => {
  const asLocalPath = filePath.replace("http://localhost:9000", os.tmpdir())
  const fileContent = await fs.readFile(asLocalPath, { encoding: "utf-8" })
  await fs.rm(path.dirname(asLocalPath), { recursive: true, force: true })
  return fileContent
}

const waitForExportNotification = async (
  api,
  eventBus: IEventBusModuleService
) => {
  const subscriberExecution = TestEventUtils.waitSubscribersExecution(
    `${Modules.NOTIFICATION}.notification.${CommonEvents.CREATED}`,
    eventBus
  )
  await subscriberExecution
  const notifications = (await api.get("/admin/notifications", adminHeaders))
    .data.notifications

  return notifications
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let customer
    let otherCustomer

    let eventBus: IEventBusModuleService

    beforeAll(async () => {
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      customer = (
        await api.post(
          "/admin/customers",
          {
            email: "jane@example.com",
            first_name: "Jane",
            last_name: "Doe",
            company_name: "Acme",
          },
          adminHeaders
        )
      ).data.customer

      await api.post(
        `/admin/customers/${customer.id}/addresses`,
        {
          first_name: "Jane",
          last_name: "Doe",
          address_1: "123 Main St",
          city: "Berlin",
          country_code: "de",
          postal_code: "10115",
        },
        adminHeaders
      )

      otherCustomer = (
        await api.post(
          "/admin/customers",
          {
            email: "john@example.com",
            first_name: "John",
            last_name: "Smith",
          },
          adminHeaders
        )
      ).data.customer

      await dbUtils.snapshot()
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/customers/export", () => {
      it("should export a JSON file with the customer's PII and addresses", async () => {
        const res = await api.post(
          `/admin/customers/export?id=${customer.id}&fields=*addresses`,
          { format: "json" },
          adminHeaders
        )

        expect(res.data.transaction_id).toBeTruthy()

        const notifications = await waitForExportNotification(api, eventBus)

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Customer export",
              description: "Customer export completed successfully!",
              file: expect.objectContaining({
                url: expect.stringContaining("-customer-exports.json"),
                filename: expect.any(String),
                mimeType: "application/json",
              }),
            }),
          })
        )

        const contents = JSON.parse(
          await readExportFile(notifications[0].data.file.url)
        )

        expect(contents).toHaveLength(1)
        expect(contents[0]).toEqual(
          expect.objectContaining({
            id: customer.id,
            email: "jane@example.com",
            first_name: "Jane",
            last_name: "Doe",
            company_name: "Acme",
            addresses: expect.arrayContaining([
              expect.objectContaining({
                address_1: "123 Main St",
                city: "Berlin",
                country_code: "de",
                postal_code: "10115",
              }),
            ]),
          })
        )
      })

      it("should export a CSV file when the format is csv", async () => {
        const res = await api.post(
          `/admin/customers/export?id=${customer.id}`,
          { format: "csv" },
          adminHeaders
        )

        expect(res.data.transaction_id).toBeTruthy()

        const notifications = await waitForExportNotification(api, eventBus)

        expect(notifications[0].data.file.mimeType).toBe("text/csv")
        expect(notifications[0].data.file.url).toContain(
          "-customer-exports.csv"
        )

        const rows = csv2json(
          await readExportFile(notifications[0].data.file.url)
        )

        expect(rows).toHaveLength(1)
        expect(rows[0]).toEqual(
          expect.objectContaining({
            id: customer.id,
            email: "jane@example.com",
          })
        )
      })

      it("should export a file containing all customers when no id is provided", async () => {
        const res = await api.post(
          `/admin/customers/export`,
          { format: "csv" },
          adminHeaders
        )

        expect(res.data.transaction_id).toBeTruthy()

        const notifications = await waitForExportNotification(api, eventBus)

        expect(notifications[0].data.file.mimeType).toBe("text/csv")
        expect(notifications[0].data.file.url).toContain(
          "-customer-exports.csv"
        )

        const rows = csv2json(
          await readExportFile(notifications[0].data.file.url)
        )

        expect(rows).toHaveLength(2)
        expect(rows).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customer.id,
              email: "jane@example.com",
            }),
            expect.objectContaining({
              id: otherCustomer.id,
              email: "john@example.com",
            }),
          ])
        )
      })
    })
  },
})
