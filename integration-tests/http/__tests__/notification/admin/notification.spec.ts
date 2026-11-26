import { INotificationModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin notifications", () => {
      let firstAdminHeaders
      let secondAdminHeaders
      let firstAdminNotification
      let secondAdminNotification
      let broadcastNotification

      beforeEach(async () => {
        const container = getContainer()
        firstAdminHeaders = { headers: {} }
        secondAdminHeaders = { headers: {} }

        const { user: firstAdmin } = await createAdminUser(
          dbConnection,
          firstAdminHeaders,
          container,
          { email: "first@medusa.js" }
        )
        const { user: secondAdmin } = await createAdminUser(
          dbConnection,
          secondAdminHeaders,
          container,
          { email: "second@medusa.js" }
        )

        const notificationModule: INotificationModuleService =
          container.resolve(Modules.NOTIFICATION)

        ;[
          firstAdminNotification,
          secondAdminNotification,
          broadcastNotification,
        ] = await notificationModule.createNotifications([
          {
            to: firstAdmin.id,
            channel: "feed",
            template: "admin-ui",
            data: { title: "Order export", file: { url: "first-export" } },
          },
          {
            to: secondAdmin.id,
            channel: "feed",
            template: "admin-ui",
            data: { title: "Order export", file: { url: "second-export" } },
          },
          {
            to: "",
            channel: "feed",
            template: "admin-ui",
            data: { title: "Announcement" },
          },
        ])
      })

      describe("GET /admin/notifications", () => {
        it("should only return feed notifications addressed to the requester or to everyone", async () => {
          const response = await api.get(
            "/admin/notifications",
            secondAdminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.notifications.map((n) => n.id).sort()).toEqual(
            [secondAdminNotification.id, broadcastNotification.id].sort()
          )
        })

        it("should not return another admin's feed notification when filtering by its recipient", async () => {
          const response = await api.get(
            `/admin/notifications?channel=feed&to[]=${firstAdminNotification.to}`,
            secondAdminHeaders
          )

          expect(response.data.notifications).toEqual([])
        })

        it("should apply free-text search within the requester's notifications", async () => {
          const ownResponse = await api.get(
            `/admin/notifications?q=${secondAdminNotification.to}`,
            secondAdminHeaders
          )

          expect(ownResponse.status).toEqual(200)
          expect(ownResponse.data.notifications.map((n) => n.id)).toEqual([
            secondAdminNotification.id,
          ])

          const otherResponse = await api.get(
            `/admin/notifications?q=${firstAdminNotification.to}`,
            secondAdminHeaders
          )

          expect(otherResponse.data.notifications).toEqual([])
        })
      })

      describe("GET /admin/notifications/:id", () => {
        it("should return the requester's feed notification", async () => {
          const response = await api.get(
            `/admin/notifications/${firstAdminNotification.id}`,
            firstAdminHeaders
          )

          expect(response.data.notification.id).toEqual(
            firstAdminNotification.id
          )
        })

        it("should return 404 for another admin's feed notification", async () => {
          const error = await api
            .get(
              `/admin/notifications/${firstAdminNotification.id}`,
              secondAdminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
        })
      })
    })
  },
})
