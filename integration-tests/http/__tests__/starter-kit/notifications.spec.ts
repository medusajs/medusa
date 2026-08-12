import {
  IEventBusModuleService,
  INotificationModuleService,
} from "@medusajs/framework/types"
import {
  AuthWorkflowEvents,
  InviteWorkflowEvents,
  Modules,
} from "@medusajs/framework/utils"
import {
  TestEventUtils,
  medusaIntegrationTestRunner,
} from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let eventBus: IEventBusModuleService
    let notificationService: INotificationModuleService

    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      eventBus = getContainer().resolve(Modules.EVENT_BUS)
      notificationService = getContainer().resolve(Modules.NOTIFICATION)
      await dbUtils.snapshot()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    describe("Starter kit plugin notifications", () => {
      it("sends an invite email when an invite is created", async () => {
        const createSpy = jest.spyOn(
          notificationService,
          "createNotifications"
        )
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          InviteWorkflowEvents.CREATED,
          eventBus
        )

        const invite = (
          await api.post(
            "/admin/invites",
            {
              email: "starter-kit-invite@medusa.js",
            },
            adminHeaders
          )
        ).data.invite

        await subscriberExecution

        const notifications = (
          await api.get("/admin/notifications?fields=+from", adminHeaders)
        ).data.notifications

        const notification = notifications.find(
          (n) => n.to === "starter-kit-invite@medusa.js"
        )

        expect(notification).toEqual(
          expect.objectContaining({
            from: "noreply@acme.com",
            to: "starter-kit-invite@medusa.js",
            channel: "email",
            trigger_type: InviteWorkflowEvents.CREATED,
            resource_id: invite.id,
            resource_type: "invite",
          })
        )
        expect(createSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              subject: "You've been invited to join Acme",
              html: expect.stringContaining(
                `/app/invite?token=${invite.token}`
              ),
            }),
          })
        )
      })

      it("sends a user password reset email with the admin URL", async () => {
        const createSpy = jest.spyOn(
          notificationService,
          "createNotifications"
        )
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          AuthWorkflowEvents.PASSWORD_RESET,
          eventBus
        )

        const response = await api.post(
          "/auth/user/emailpass/reset-password",
          {
            identifier: "admin@medusa.js",
          }
        )

        expect(response.status).toEqual(201)
        await subscriberExecution

        const notifications = (
          await api.get("/admin/notifications?fields=+from", adminHeaders)
        ).data.notifications

        const notification = notifications.find(
          (n) =>
            n.trigger_type === AuthWorkflowEvents.PASSWORD_RESET &&
            n.to === "admin@medusa.js"
        )

        expect(notification).toEqual(
          expect.objectContaining({
            from: "noreply@acme.com",
            to: "admin@medusa.js",
            channel: "email",
            trigger_type: AuthWorkflowEvents.PASSWORD_RESET,
          })
        )
        expect(createSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              subject: "Reset your password",
              html: expect.stringMatching(
                /Acme[\s\S]*\/app\/reset-password\?token=.+&amp;email=admin%40medusa\.js/
              ),
            }),
          })
        )
      })

      it("sends a customer password reset email falling back to the admin URL", async () => {
        const createSpy = jest.spyOn(
          notificationService,
          "createNotifications"
        )

        await api.post("/auth/customer/emailpass/register", {
          email: "starter-kit-customer@medusa.js",
          password: "secret_password",
        })

        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          AuthWorkflowEvents.PASSWORD_RESET,
          eventBus
        )

        const response = await api.post(
          "/auth/customer/emailpass/reset-password",
          {
            identifier: "starter-kit-customer@medusa.js",
          }
        )

        expect(response.status).toEqual(201)
        await subscriberExecution

        const notifications = (
          await api.get("/admin/notifications?fields=+from", adminHeaders)
        ).data.notifications

        const notification = notifications.find(
          (n) =>
            n.trigger_type === AuthWorkflowEvents.PASSWORD_RESET &&
            n.to === "starter-kit-customer@medusa.js"
        )

        expect(notification).toEqual(
          expect.objectContaining({
            from: "noreply@acme.com",
            to: "starter-kit-customer@medusa.js",
            channel: "email",
            trigger_type: AuthWorkflowEvents.PASSWORD_RESET,
          })
        )
        expect(createSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              subject: "Reset your password",
              html: expect.stringMatching(
                /Acme[\s\S]*\/app\/reset-password\?token=.+&amp;email=starter-kit-customer%40medusa\.js/
              ),
            }),
          })
        )
      })
    })
  },
})
