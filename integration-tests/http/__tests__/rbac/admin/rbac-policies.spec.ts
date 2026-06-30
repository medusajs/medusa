import { getAssignablePoliciesWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let container

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      await dbUtils.snapshot()
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
          const response = await api.get(
            "/admin/rbac/policies?limit=1000",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toBeGreaterThanOrEqual(3)
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
          expect(response.data.count).toEqual(6)
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
            "/admin/rbac/policies?operation=read&limit=1000",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toBeGreaterThanOrEqual(2)
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

      describe("GET /admin/rbac/policies/assignable", () => {
        // Headers for actors with varying levels of permission coverage.
        // `adminHeaders` is the super-admin baseline (holds `*:*`).
        const productManagerHeaders = { headers: { ...adminHeaders.headers } }
        const universalReaderHeaders = { headers: { ...adminHeaders.headers } }
        const productReaderHeaders = { headers: { ...adminHeaders.headers } }
        const noRolesUserHeaders = { headers: { ...adminHeaders.headers } }

        // Candidate policy IDs we ask the endpoint about. Their `(resource,
        // operation)` shape drives whether each scoped actor can cover them.
        let productReadId: string
        let productCreateId: string
        let productUpdateId: string
        let productDeleteId: string
        let customerReadId: string
        let customerCreateId: string
        let wildcardPolicyId: string
        let productWildcardId: string
        let universalReadId: string
        let rbacPolicyReadId: string

        beforeEach(async () => {
          const rbacModule = container.resolve(Modules.RBAC)

          // Concrete candidate policies — covered by various wildcard grants.
          const ensurePolicy = async (params: {
            key: string
            resource: string
            operation: string
            name: string
          }) => {
            const [existing] = await rbacModule.listRbacPolicies({
              key: params.key,
            })
            if (existing) {
              return existing
            }
            const [created] = await rbacModule.createRbacPolicies([params])
            return created
          }

          const productRead = await ensurePolicy({
            key: "product:read",
            resource: "product",
            operation: "read",
            name: "Read Products",
          })
          const productCreate = await ensurePolicy({
            key: "product:create",
            resource: "product",
            operation: "create",
            name: "Create Products",
          })
          const productUpdate = await ensurePolicy({
            key: "product:update",
            resource: "product",
            operation: "update",
            name: "Update Products",
          })
          const productDelete = await ensurePolicy({
            key: "product:delete",
            resource: "product",
            operation: "delete",
            name: "Delete Products",
          })
          const customerRead = await ensurePolicy({
            key: "customer:read",
            resource: "customer",
            operation: "read",
            name: "Read Customers",
          })
          const customerCreate = await ensurePolicy({
            key: "customer:create",
            resource: "customer",
            operation: "create",
            name: "Create Customers",
          })

          // Wildcard grants attached to actor roles.
          const productWildcard = await ensurePolicy({
            key: "product:*",
            resource: "product",
            operation: "*",
            name: "Manage Products",
          })
          const universalRead = await ensurePolicy({
            key: "*:read",
            resource: "*",
            operation: "read",
            name: "Read Anything",
          })

          // A literal `*:*` candidate row — only a `*:*` holder can assign it.
          const fullWildcard = await ensurePolicy({
            key: "*:*",
            resource: "*",
            operation: "*",
            name: "Everything",
          })

          // The route is guarded by `rbac_policy:read` — every non-super-admin
          // actor below also holds it so they reach the workflow.
          const rbacPolicyRead = await ensurePolicy({
            key: "rbac_policy:read",
            resource: "rbac_policy",
            operation: "read",
            name: "Read Policies",
          })

          productReadId = productRead.id
          productCreateId = productCreate.id
          productUpdateId = productUpdate.id
          productDeleteId = productDelete.id
          customerReadId = customerRead.id
          customerCreateId = customerCreate.id
          wildcardPolicyId = fullWildcard.id
          productWildcardId = productWildcard.id
          universalReadId = universalRead.id
          rbacPolicyReadId = rbacPolicyRead.id

          // --- Actor roles ---
          const productManagerRole = await rbacModule.createRbacRoles({
            name: "Assignable Policies — Product Manager",
          })
          const universalReaderRole = await rbacModule.createRbacRoles({
            name: "Assignable Policies — Universal Reader",
          })
          const productReaderRole = await rbacModule.createRbacRoles({
            name: "Assignable Policies — Product Reader",
          })

          await rbacModule.createRbacRolePolicies([
            {
              role_id: productManagerRole.id,
              policy_id: productWildcard.id,
            },
            {
              role_id: productManagerRole.id,
              policy_id: rbacPolicyRead.id,
            },
            { role_id: universalReaderRole.id, policy_id: universalRead.id },
            {
              role_id: universalReaderRole.id,
              policy_id: rbacPolicyRead.id,
            },
            { role_id: productReaderRole.id, policy_id: productRead.id },
            {
              role_id: productReaderRole.id,
              policy_id: rbacPolicyRead.id,
            },
          ])

          await createAdminUser(
            dbConnection,
            productManagerHeaders,
            container,
            {
              email: "assignable-policies-product-manager@medusa.js",
              roles: [productManagerRole.id],
            }
          )
          await createAdminUser(
            dbConnection,
            universalReaderHeaders,
            container,
            {
              email: "assignable-policies-universal-reader@medusa.js",
              roles: [universalReaderRole.id],
            }
          )
          await createAdminUser(dbConnection, productReaderHeaders, container, {
            email: "assignable-policies-product-reader@medusa.js",
            roles: [productReaderRole.id],
          })
          await createAdminUser(dbConnection, noRolesUserHeaders, container, {
            email: "assignable-policies-no-roles@medusa.js",
            roles: [],
          })
        })

        it("returns every candidate policy for a super-admin (`*:*`)", async () => {
          const response = await api.get(
            "/admin/rbac/policies/assignable?limit=1000",
            adminHeaders
          )

          const ids = response.data.policies.map((p: { id: string }) => p.id)
          expect(ids).toEqual(
            expect.arrayContaining([
              productReadId,
              productCreateId,
              productUpdateId,
              productDeleteId,
              customerReadId,
              customerCreateId,
              wildcardPolicyId,
            ])
          )
        })

        it("expands `resource:*` — product:* actor sees all product policies including the wildcard itself", async () => {
          const response = await api.get(
            "/admin/rbac/policies/assignable",
            productManagerHeaders
          )

          const ids = response.data.policies.map((p: { id: string }) => p.id)
          expect(ids).toEqual(
            expect.arrayContaining([
              productReadId,
              productCreateId,
              productUpdateId,
              productDeleteId,
              productWildcardId,
              rbacPolicyReadId,
            ])
          )
          expect(ids.length).toEqual(6)
        })

        it("expands `*:op` — *:read actor sees all read policies including the wildcard itself", async () => {
          const response = await api.get(
            "/admin/rbac/policies/assignable?limit=1000",
            universalReaderHeaders
          )

          const ids = response.data.policies.map((p: { id: string }) => p.id)
          expect(ids).toEqual(
            expect.arrayContaining([
              productReadId,
              customerReadId,
              universalReadId,
              rbacPolicyReadId,
            ])
          )
        })

        it("literal grant — product:read actor sees product:read and any policy covered by that grant", async () => {
          const response = await api.get(
            "/admin/rbac/policies/assignable",
            productReaderHeaders
          )

          const ids = response.data.policies.map((p: { id: string }) => p.id)
          expect(ids).toEqual(
            expect.arrayContaining([productReadId, rbacPolicyReadId])
          )
          expect(ids.length).toEqual(2)
        })

        it("only a `*:*` holder can assign a literal `*:*` policy", async () => {
          // Super-admin holds *:* → can assign the wildcard policy row.
          const superAdminIds = (
            await api.get(
              `/admin/rbac/policies/assignable?id=${wildcardPolicyId}`,
              adminHeaders
            )
          ).data.policies.map((p: { id: string }) => p.id)
          expect(superAdminIds).toContain(wildcardPolicyId)

          // Every scoped actor cannot.
          const others = await Promise.all([
            api.get(
              `/admin/rbac/policies/assignable?id=${wildcardPolicyId}`,
              productManagerHeaders
            ),
            api.get(
              `/admin/rbac/policies/assignable?id=${wildcardPolicyId}`,
              universalReaderHeaders
            ),
            api.get(
              `/admin/rbac/policies/assignable?id=${wildcardPolicyId}`,
              productReaderHeaders
            ),
          ])
          for (const response of others) {
            const ids = response.data.policies.map((p: { id: string }) => p.id)
            expect(ids).not.toContain(wildcardPolicyId)
          }
        })

        it("returns empty policies via the workflow when the actor holds no roles", async () => {
          // No-roles actor can't pass the route's `rbac_policy:read` gate,
          // so we exercise the empty-actor branch by running the workflow
          // directly with their id.
          const userModule = container.resolve(Modules.USER)
          const [noRolesUser] = await userModule.listUsers({
            email: "assignable-policies-no-roles@medusa.js",
          })

          const { result } = await getAssignablePoliciesWorkflow(container).run(
            {
              input: {
                actor_id: noRolesUser.id,
                actor: "user",
              },
            }
          )

          expect(result.policies).toEqual([])
          expect(result.count).toEqual(0)
        })

        it("applies the `id` filter when forwarded", async () => {
          const response = await api.get(
            `/admin/rbac/policies/assignable?id=${productReadId}`,
            adminHeaders
          )

          const ids = response.data.policies.map((p: { id: string }) => p.id)
          expect(ids).toEqual([productReadId])
          expect(response.data.count).toEqual(1)
        })

        it("paginates the assignable subset, not the raw rbac_policy set", async () => {
          // product:* actor is assignable exactly 6 policies:
          //   product:read/create/update/delete, product:* (self),
          //   rbac_policy:read.
          // Asking for limit=2 must return 2 rows (a full page), and the next
          // page (offset=2, limit=2) must return the remaining 2 — proving
          // filtering happens before pagination. count must reflect the total
          // assignable, not the page size.
          const firstPage = await api.get(
            "/admin/rbac/policies/assignable?limit=2&offset=0&order=id",
            productManagerHeaders
          )

          expect(firstPage.data.policies).toHaveLength(2)
          expect(firstPage.data.count).toEqual(6)

          const secondPage = await api.get(
            "/admin/rbac/policies/assignable?limit=2&offset=2&order=id",
            productManagerHeaders
          )

          expect(secondPage.data.policies).toHaveLength(2)
          expect(secondPage.data.count).toEqual(6)

          const thirdPage = await api.get(
            "/admin/rbac/policies/assignable?limit=2&offset=4&order=id",
            productManagerHeaders
          )

          expect(thirdPage.data.policies).toHaveLength(2)
          expect(thirdPage.data.count).toEqual(6)

          // No overlap between the pages
          const firstIds = firstPage.data.policies.map(
            (p: { id: string }) => p.id
          )
          const secondIds = secondPage.data.policies.map(
            (p: { id: string }) => p.id
          )
          const thirdIds = thirdPage.data.policies.map(
            (p: { id: string }) => p.id
          )
          expect(firstIds).not.toEqual(
            expect.arrayContaining(secondIds as string[])
          )
          expect(firstIds).not.toEqual(
            expect.arrayContaining(thirdIds as string[])
          )
          expect(secondIds).not.toEqual(
            expect.arrayContaining(thirdIds as string[])
          )

          // Union covers exactly the assignable set.
          expect(new Set([...firstIds, ...secondIds, ...thirdIds])).toEqual(
            new Set([
              productReadId,
              productCreateId,
              productUpdateId,
              productDeleteId,
              productWildcardId,
              rbacPolicyReadId,
            ])
          )
        })
      })
    })
  },
})
