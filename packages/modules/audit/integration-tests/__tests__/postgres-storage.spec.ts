import { IAuditModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  LicenseFeature,
  Modules,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner, testLicense } from "@medusajs/test-utils"
import { PostgresAuditService } from "../../src/providers"

jest.setTimeout(60000)

const DAY_MS = 24 * 60 * 60 * 1000

const provider = (service: IAuditModuleService): PostgresAuditService =>
  (service as any).provider_.provider_

moduleIntegrationTestRunner<IAuditModuleService>({
  moduleName: Modules.AUDIT,
  resolve: __dirname + "/../..",
  moduleOptions: {
    retention_days: 30,
    buffer: { max_size: 2, flush_interval_ms: 60_000 },
  },
  injectedDependencies: {
    [ContainerRegistrationKeys.LICENSE]: testLicense([LicenseFeature.AUDIT]),
  },
  testSuite: ({ service }) => {
    const seed = async () => {
      service.createAuditLogs([
        {
          action: "POST /admin/orders/:id/cancel",
          actor_type: "user",
          actor_id: "user_1",
          resource_type: "order",
          resource_id: "order_1",
          outcome: "succeeded",
          started_at: "2026-11-10T10:00:00.000Z",
          ended_at: "2026-11-10T10:00:00.250Z",
          request: {
            method: "POST",
            route: "/admin/orders/:id/cancel",
            path: "/admin/orders/order_1/cancel",
            status_code: 200,
            request_id: "req_1",
            ip_address: "127.0.0.1",
            user_agent: "jest",
          },
          request_data: { no_notification: true },
          response_data: { status: "canceled" },
        },
        {
          action: "POST /admin/products/:id",
          actor_type: "api_key",
          actor_id: "apk_1",
          resource_type: "product",
          resource_id: "prod_1",
          outcome: "failed",
          started_at: "2026-11-10T11:00:00.000Z",
        },
        {
          action: "POST /auth/user/emailpass",
          actor_type: "anonymous",
          outcome: "denied",
          started_at: "2026-11-10T12:00:00.000Z",
          metadata: { reason: "invalid credentials" },
        },
        {
          action: "order.export",
          actor_type: "system",
          resource_type: "order",
          started_at: "2026-11-10T13:00:00.000Z",
        },
      ])
      await service.flush()
    }

    describe("Postgres audit storage", () => {
      it("stores flushed records and reads them back newest first", async () => {
        await seed()

        const [records, count] = await service.listAndCountAuditLogs()
        expect(count).toBe(4)
        expect(records.map((r) => r.action)).toEqual([
          "order.export",
          "POST /auth/user/emailpass",
          "POST /admin/products/:id",
          "POST /admin/orders/:id/cancel",
        ])

        const cancel = records[3]
        expect(cancel).toEqual({
          id: expect.stringMatching(/^audlog_/),
          started_at: new Date("2026-11-10T10:00:00.000Z"),
          ended_at: new Date("2026-11-10T10:00:00.250Z"),
          actor_type: "user",
          actor_id: "user_1",
          impersonator_id: null,
          action: "POST /admin/orders/:id/cancel",
          resource_type: "order",
          resource_id: "order_1",
          outcome: "succeeded",
          request: {
            method: "POST",
            route: "/admin/orders/:id/cancel",
            path: "/admin/orders/order_1/cancel",
            status_code: 200,
            request_id: "req_1",
            ip_address: "127.0.0.1",
            user_agent: "jest",
          },
          request_data: { no_notification: true },
          response_data: { status: "canceled" },
          metadata: null,
        })

        await expect(service.retrieveAuditLog(cancel.id)).resolves.toEqual(
          cancel
        )
        await expect(
          service.retrieveAuditLog("audlog_missing")
        ).rejects.toThrow("was not found")
      })

      it("writes once the buffer reaches max size, without a flush", async () => {
        service.createAuditLogs([{ action: "a" }, { action: "b" }])

        await new Promise((resolve) => setTimeout(resolve, 200))

        const [, count] = await service.listAndCountAuditLogs()
        expect(count).toBe(2)
      })

      it("filters by actor, resource, outcome, action and time", async () => {
        await seed()

        const actions = async (filters) =>
          (await service.listAuditLogs(filters)).map((r) => r.action)

        expect(
          await actions({ actor_type: "user", actor_id: "user_1" })
        ).toEqual(["POST /admin/orders/:id/cancel"])
        expect(await actions({ actor_type: ["api_key", "anonymous"] })).toEqual(
          ["POST /auth/user/emailpass", "POST /admin/products/:id"]
        )
        expect(await actions({ resource_type: "order" })).toEqual([
          "order.export",
          "POST /admin/orders/:id/cancel",
        ])
        expect(
          await actions({ resource_type: "order", resource_id: "order_1" })
        ).toEqual(["POST /admin/orders/:id/cancel"])
        expect(await actions({ outcome: "denied" })).toEqual([
          "POST /auth/user/emailpass",
        ])
        expect(await actions({ action: "order.export" })).toEqual([
          "order.export",
        ])
        expect(
          await actions({
            started_at: {
              $gte: "2026-11-10T11:00:00.000Z",
              $lt: new Date("2026-11-10T13:00:00.000Z"),
            },
          })
        ).toEqual(["POST /auth/user/emailpass", "POST /admin/products/:id"])
        expect(await actions({ q: "PRODUCTS" })).toEqual([
          "POST /admin/products/:id",
        ])
      })

      it("paginates, sorts and selects fields", async () => {
        await seed()

        const [page, count] = await service.listAndCountAuditLogs(
          { resource_type: ["order", "product"] },
          { skip: 1, take: 1, order: { started_at: "ASC" } }
        )
        expect(count).toBe(3)
        expect(page.map((r) => r.action)).toEqual(["POST /admin/products/:id"])

        const [selected] = await service.listAuditLogs(
          {},
          { select: ["action"], take: 1 }
        )
        expect(Object.keys(selected).sort()).toEqual(["action", "id"])
      })

      it("prunes only records past retention, also when run concurrently", async () => {
        const now = Date.now()
        service.createAuditLogs([
          { action: "old", started_at: new Date(now - 31 * DAY_MS) },
          { action: "older", started_at: new Date(now - 400 * DAY_MS) },
          { action: "recent", started_at: new Date(now - 29 * DAY_MS) },
        ])
        await service.flush()

        // The write above also starts a prune, so three may overlap here.
        await Promise.all([
          provider(service).prune(),
          provider(service).prune(),
        ])

        expect((await service.listAuditLogs()).map((r) => r.action)).toEqual([
          "recent",
        ])
      })

      it("prunes at most once an hour", async () => {
        service.createAuditLogs([{ action: "a" }, { action: "b" }])
        await service.flush()

        service.createAuditLogs({
          action: "old",
          started_at: new Date(Date.now() - 400 * DAY_MS),
        })
        await service.flush()
        await new Promise((resolve) => setTimeout(resolve, 200))

        expect(await service.listAuditLogs()).toHaveLength(3)
      })

      it("is the default storage and exposes only audit log fields", async () => {
        expect((provider(service).constructor as any).identifier).toBe(
          PostgresAuditService.identifier
        )

        service.createAuditLogs({ action: "a" })
        await service.flush()

        const [auditLog] = await service.listAuditLogs()
        expect(Object.keys(auditLog)).not.toEqual(
          expect.arrayContaining(["created_at", "updated_at", "deleted_at"])
        )
      })
    })
  },
})
