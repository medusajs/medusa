import { IAuditModuleService } from "@medusajs/framework/types"
import { ApiKeyType, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_AUDIT_MODULE = "true"
process.env.ENABLE_RBAC_MODULE = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let auditModule: IAuditModuleService
    let adminId: string
    const noRolesHeaders = { headers: { ...adminHeaders.headers } }

    // Records are buffered by the module, so flush before reading them back.
    const listAuditLogs = async (params: Record<string, unknown>) => {
      await auditModule.flush()
      const response = await api.get("/admin/audit-logs", {
        ...adminHeaders,
        params,
      })
      return response.data
    }

    beforeAll(async () => {
      const container = getContainer()
      auditModule = container.resolve(Modules.AUDIT)

      const { user } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      )
      adminId = user.id

      await createAdminUser(dbConnection, noRolesHeaders, container, {
        email: "no-roles@medusa.js",
        roles: [],
      })

      await dbUtils.snapshot()
    })

    describe("Audit middleware", () => {
      it("records a create with the ID of the created resource", async () => {
        const created = await api.post(
          "/admin/customers",
          { email: "audited@medusa.js" },
          adminHeaders
        )
        const customerId = created.data.customer.id

        const { audit_logs, count } = await listAuditLogs({
          action: "customer.create",
        })

        expect(count).toEqual(1)
        expect(audit_logs[0]).toEqual({
          id: expect.stringMatching(/^audlog_/),
          started_at: expect.any(String),
          ended_at: expect.any(String),
          actor_type: "user",
          actor_id: adminId,
          impersonator_id: null,
          action: "customer.create",
          resource_type: "customer",
          resource_id: customerId,
          outcome: "succeeded",
          request: {
            method: "POST",
            route: "/admin/customers",
            path: "/admin/customers",
            status_code: 200,
            request_id: expect.any(String),
            ip_address: expect.any(String),
            user_agent: expect.any(String),
          },
          request_data: null,
          response_data: null,
          metadata: null,
        })
        expect(JSON.stringify(audit_logs[0])).not.toContain("audited@medusa.js")
      })

      it("records a mutation with the default action and resource", async () => {
        const created = await api.post(
          "/admin/customers",
          { email: "updated@medusa.js" },
          adminHeaders
        )
        const customerId = created.data.customer.id

        await api.post(
          `/admin/customers/${customerId}`,
          { first_name: "Jane" },
          adminHeaders
        )

        const { audit_logs } = await listAuditLogs({
          resource_type: "customer",
          resource_id: customerId,
        })

        expect(audit_logs.map((log) => log.action)).toEqual([
          "customer.update",
          "customer.create",
        ])
      })

      it("records a request rejected by authentication as denied", async () => {
        const response = await api
          .delete("/admin/products/prod_123")
          .catch((e) => e.response)
        expect(response.status).toEqual(401)

        const { audit_logs } = await listAuditLogs({ outcome: "denied" })

        expect(audit_logs).toEqual([
          expect.objectContaining({
            action: "product.delete",
            actor_type: "anonymous",
            actor_id: null,
            resource_type: "product",
            resource_id: "prod_123",
            request: expect.objectContaining({ status_code: 401 }),
          }),
        ])
      })

      it("records a validation failure as failed", async () => {
        const response = await api
          .post("/admin/customers", { unknown_field: true }, adminHeaders)
          .catch((e) => e.response)
        expect(response.status).toEqual(400)

        const { audit_logs } = await listAuditLogs({ outcome: "failed" })

        expect(audit_logs).toEqual([
          expect.objectContaining({
            action: "customer.create",
            actor_id: adminId,
            resource_type: "customer",
            resource_id: null,
          }),
        ])
      })

      it("records a secret API key as the actor", async () => {
        const created = await api.post(
          "/admin/api-keys",
          { title: "Audit key", type: ApiKeyType.SECRET },
          adminHeaders
        )
        const apiKey = created.data.api_key

        await api.post(
          "/admin/sales-channels",
          { name: "Created with a key" },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${apiKey.token}:`).toString(
                "base64"
              )}`,
            },
          }
        )
        await api.post(
          "/admin/stock-locations",
          { name: "Created with a key" },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${apiKey.token}:`).toString(
                "base64"
              )}`,
            },
          }
        )

        const { audit_logs } = await listAuditLogs({ actor_type: "api-key" })

        expect(audit_logs).toEqual([
          expect.objectContaining({
            action: "stock_location.create",
            actor_id: apiKey.id,
            metadata: { api_key_created_by: adminId },
          }),
        ])
        expect(JSON.stringify(audit_logs)).not.toContain(apiKey.token)
      })

      it("lets the application change what is recorded", async () => {
        // The application sets `audit: false` on POST /admin/sales-channels and
        // adds `requestData` to POST /admin/regions.
        await api.post(
          "/admin/sales-channels",
          { name: "Not audited" },
          adminHeaders
        )
        const region = await api.post(
          "/admin/regions",
          { name: "Audited region", currency_code: "usd" },
          adminHeaders
        )

        const { audit_logs } = await listAuditLogs({})

        expect(audit_logs).toEqual([
          expect.objectContaining({
            action: "region.create",
            resource_type: "region",
            resource_id: region.data.region.id,
            request_data: { name: "Audited region" },
          }),
        ])
      })

      it("does not record GET requests", async () => {
        await api.get("/admin/customers", adminHeaders)
        await api.get("/admin/audit-logs", adminHeaders)

        const { count } = await listAuditLogs({})
        expect(count).toEqual(0)
      })
    })

    describe("GET /admin/audit-logs", () => {
      it("lists, filters, paginates and retrieves audit logs", async () => {
        await api.post(
          "/admin/customers",
          { email: "a@medusa.js" },
          adminHeaders
        )
        await api.post(
          "/admin/customers",
          { email: "b@medusa.js" },
          adminHeaders
        )
        await api.post("/admin/customer-groups", { name: "VIP" }, adminHeaders)

        const firstPage = await listAuditLogs({ limit: 2, offset: 0 })
        expect(firstPage.count).toEqual(3)
        expect(firstPage.limit).toEqual(2)
        expect(firstPage.offset).toEqual(0)
        expect(firstPage.audit_logs).toHaveLength(2)
        expect(firstPage.audit_logs[0].action).toEqual("customer_group.create")

        const oldestFirst = await listAuditLogs({ order: "started_at" })
        expect(oldestFirst.audit_logs[0].action).toEqual("customer.create")

        const filtered = await listAuditLogs({
          action: ["customer_group.create"],
          started_at: { $gte: new Date(Date.now() - 60_000).toISOString() },
        })
        expect(filtered.count).toEqual(1)

        const selected = await listAuditLogs({ fields: "id,action" })
        expect(selected.audit_logs[0]).toEqual({
          id: expect.any(String),
          action: "customer_group.create",
        })

        const id = firstPage.audit_logs[0].id
        const retrieved = await api.get(`/admin/audit-logs/${id}`, adminHeaders)
        expect(retrieved.data.audit_log).toEqual(firstPage.audit_logs[0])

        const missing = await api
          .get("/admin/audit-logs/audlog_missing", adminHeaders)
          .catch((e) => e.response)
        expect(missing.status).toEqual(404)
      })

      it("rejects an invalid sort order", async () => {
        const response = await api
          .get("/admin/audit-logs?order=action", adminHeaders)
          .catch((e) => e.response)
        expect(response.status).toEqual(400)
      })

      it("requires the audit_log:read policy", async () => {
        const response = await api
          .get("/admin/audit-logs", noRolesHeaders)
          .catch((e) => e.response)
        expect(response.status).toEqual(403)
      })
    })
  },
})
