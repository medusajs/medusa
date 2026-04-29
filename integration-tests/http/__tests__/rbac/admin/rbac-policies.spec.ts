import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let container

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("RBAC Policies - Admin API", () => {
      describe("POST /admin/rbac/policies", () => {
        it("should create a policy", async () => {
          const response = await api.post(
            "/admin/rbac/policies",
            {
              key: "read:products",
              resource: "product",
              operation: "read",
              name: "Read Products",
              description: "Permission to read products",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.policy).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              key: "read:products",
              resource: "product",
              operation: "read",
              name: "Read Products",
              description: "Permission to read products",
            })
          )
        })

        it("should create a policy with metadata", async () => {
          const response = await api.post(
            "/admin/rbac/policies",
            {
              key: "write:orders",
              resource: "order",
              operation: "write",
              name: "Write Orders",
              metadata: { category: "order_management" },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.policy).toEqual(
            expect.objectContaining({
              key: "write:orders",
              resource: "order",
              operation: "write",
              metadata: { category: "order_management" },
            })
          )
        })
      })

      describe("GET /admin/rbac/policies", () => {
        beforeEach(async () => {
          await api.post(
            "/admin/rbac/policies",
            {
              key: "read:products",
              resource: "product",
              operation: "read",
              name: "Read Products",
            },
            adminHeaders
          )

          await api.post(
            "/admin/rbac/policies",
            {
              key: "write:products",
              resource: "product",
              operation: "write",
              name: "Write Products",
            },
            adminHeaders
          )

          await api.post(
            "/admin/rbac/policies",
            {
              key: "read:orders",
              resource: "order",
              operation: "read",
              name: "Read Orders",
            },
            adminHeaders
          )
        })

        it("should list all policies", async () => {
          const response = await api.get("/admin/rbac/policies", adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(4)
          expect(response.data.policies).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                key: "read:products",
                resource: "product",
                operation: "read",
              }),
              expect.objectContaining({
                key: "write:products",
                resource: "product",
                operation: "write",
              }),
              expect.objectContaining({
                key: "read:orders",
                resource: "order",
                operation: "read",
              }),
            ])
          )
        })

        it("should filter policies by resource", async () => {
          const response = await api.get(
            "/admin/rbac/policies?resource=product",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.policies).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                key: "read:products",
                resource: "product",
              }),
              expect.objectContaining({
                key: "write:products",
                resource: "product",
              }),
            ])
          )
        })

        it("should filter policies by operation", async () => {
          const response = await api.get(
            "/admin/rbac/policies?operation=read",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.policies).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                key: "read:products",
                operation: "read",
              }),
              expect.objectContaining({
                key: "read:orders",
                operation: "read",
              }),
            ])
          )
        })
      })

      describe("GET /admin/rbac/policies/:id", () => {
        it("should retrieve a policy by id", async () => {
          const createResponse = await api.post(
            "/admin/rbac/policies",
            {
              key: "delete:users",
              resource: "user",
              operation: "delete",
              name: "Delete Users",
            },
            adminHeaders
          )

          const policyId = createResponse.data.policy.id

          const response = await api.get(
            `/admin/rbac/policies/${policyId}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.policy).toEqual(
            expect.objectContaining({
              id: policyId,
              key: "delete:users",
              resource: "user",
              operation: "delete",
              name: "Delete Users",
            })
          )
        })
      })

      describe("POST /admin/rbac/policies/:id", () => {
        it("should update a policy", async () => {
          const createResponse = await api.post(
            "/admin/rbac/policies",
            {
              key: "admin:system",
              resource: "system",
              operation: "admin",
              name: "System Admin",
            },
            adminHeaders
          )

          const policyId = createResponse.data.policy.id

          const response = await api.post(
            `/admin/rbac/policies/${policyId}`,
            {
              name: "System Administrator",
              description: "Full system access",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.policy).toEqual(
            expect.objectContaining({
              id: policyId,
              key: "admin:system",
              name: "System Administrator",
              description: "Full system access",
            })
          )
        })
      })

      describe("DELETE /admin/rbac/policies/:id", () => {
        it("should delete a policy", async () => {
          const createResponse = await api.post(
            "/admin/rbac/policies",
            {
              key: "test:delete",
              resource: "test",
              operation: "delete",
              name: "Test Delete",
            },
            adminHeaders
          )

          const policyId = createResponse.data.policy.id

          const deleteResponse = await api.delete(
            `/admin/rbac/policies/${policyId}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            id: policyId,
            object: "rbac_policy",
            deleted: true,
          })

          const listResponse = await api.get(
            "/admin/rbac/policies",
            adminHeaders
          )
          expect(
            listResponse.data.policies.find((p) => p.id === policyId)
          ).toBeUndefined()
        })
      })
    })
  },
})
