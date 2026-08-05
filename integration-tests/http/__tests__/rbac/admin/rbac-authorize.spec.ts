import {
  authorize,
  type AuthenticatedMedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http"
import type { PolicyAction } from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  PolicyOperation,
} from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_RBAC = "true"

/**
 * Covers the `authorize` middleware guarding core routes, and how role
 * assignments are matched against the scope a request acts within.
 *
 * Nothing in core populates `req.rbac_context.scope` — an application sets it
 * from a middleware of its own. So on core routes only unscoped assignments are
 * ever considered, which is what the "scoped role only" cases below assert.
 * `GET /rbac/me/permissions` accepts the scope as a query parameter, which is
 * what lets the scope matrix be exercised over HTTP.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let container

    // Each actor below holds product:read through a different assignment shape.
    const unscopedReaderHeaders = { headers: { ...adminHeaders.headers } }
    const scopedReaderHeaders = { headers: { ...adminHeaders.headers } }
    const customerReaderHeaders = { headers: { ...adminHeaders.headers } }
    const noRolesHeaders = { headers: { ...adminHeaders.headers } }

    const SCOPE = { type: "organization", id: "org_1" }
    const OTHER_SCOPE = { type: "organization", id: "org_2" }

    // Captured so the middleware can be driven directly, for the cases that
    // need a scope on the request.
    let unscopedReaderId: string
    let scopedReaderId: string
    let noRolesId: string

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)

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
        operation: PolicyOperation.read,
        name: "Read Products",
      })
      const customerRead = await ensurePolicy({
        key: "customer:read",
        resource: "customer",
        operation: PolicyOperation.read,
        name: "Read Customers",
      })

      const productReaderRole = await rbacModule.createRbacRoles({
        name: "Product Reader",
      })
      const customerReaderRole = await rbacModule.createRbacRoles({
        name: "Customer Reader",
      })

      await rbacModule.createRbacRolePolicies([
        { role_id: productReaderRole.id, policy_id: productRead.id },
        { role_id: customerReaderRole.id, policy_id: customerRead.id },
      ])

      // Unscoped assignment: privileges apply across every scope.
      const { user: unscopedUser } = await createAdminUser(
        dbConnection,
        unscopedReaderHeaders,
        container,
        {
          email: "unscoped-reader@medusa.js",
          roles: [productReaderRole.id],
        }
      )
      unscopedReaderId = unscopedUser.id

      // Holds a role, but not the one the product routes require.
      await createAdminUser(dbConnection, customerReaderHeaders, container, {
        email: "customer-reader@medusa.js",
        roles: [customerReaderRole.id],
      })

      // No assignment at all.
      const { user: noRolesUser } = await createAdminUser(
        dbConnection,
        noRolesHeaders,
        container,
        {
          email: "no-roles@medusa.js",
          roles: [],
        }
      )
      noRolesId = noRolesUser.id

      // Scoped assignment: created directly, since `createAdminUser` only
      // creates unscoped ones.
      const { user: scopedUser } = await createAdminUser(
        dbConnection,
        scopedReaderHeaders,
        container,
        { email: "scoped-reader@medusa.js", roles: [] }
      )
      scopedReaderId = scopedUser.id
      await rbacModule.createRbacRoleAssignments([
        {
          role_id: productReaderRole.id,
          reference: "user",
          reference_id: scopedUser.id,
          scope: SCOPE.type,
          scope_id: SCOPE.id,
        },
      ])

      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("authorize on a guarded core route", () => {
      it("allows an actor holding the policy through an unscoped assignment", async () => {
        const response = await api.get("/admin/products", unscopedReaderHeaders)

        expect(response.status).toEqual(200)
      })

      it("allows a super admin", async () => {
        const response = await api.get("/admin/products", adminHeaders)

        expect(response.status).toEqual(200)
      })

      it("forbids an actor whose only assignment is scoped, since the request carries no scope", async () => {
        const error = await api
          .get("/admin/products", scopedReaderHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(403)
        // No role resolves at all, so the check fails before the policies are
        // compared.
        expect(error.response.data.message).toEqual("Forbidden")
      })

      it("forbids an actor with no assignments", async () => {
        const error = await api
          .get("/admin/products", noRolesHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(403)
        expect(error.response.data.message).toEqual("Forbidden")
      })

      it("forbids an actor holding a role that does not grant the route's policy", async () => {
        const error = await api
          .get("/admin/products", customerReaderHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(403)
        // A role resolved, so the failure names the policies that were required.
        expect(error.response.data.message).toContain(
          "Insufficient permissions"
        )
        expect(error.response.data.message).toContain("product:read")
      })

      it("forbids an unauthenticated request before reaching the policy check", async () => {
        const error = await api
          .get("/admin/products", { headers: {} })
          .catch((e) => e)

        expect(error.response.status).toEqual(401)
      })
    })

    describe("scope matching", () => {
      const permissionsFor = async (headers, scope?: typeof SCOPE) => {
        const query = scope ? `?scope=${scope.type}&scope_id=${scope.id}` : ""
        const response = await api.get(`/rbac/me/permissions${query}`, headers)

        expect(response.status).toEqual(200)
        return response.data.permissions
      }

      it("matches an unscoped assignment when the request carries no scope", async () => {
        expect(await permissionsFor(unscopedReaderHeaders)).toContain(
          "product:read"
        )
      })

      it("matches an unscoped assignment within any scope", async () => {
        expect(await permissionsFor(unscopedReaderHeaders, SCOPE)).toContain(
          "product:read"
        )
        expect(
          await permissionsFor(unscopedReaderHeaders, OTHER_SCOPE)
        ).toContain("product:read")
      })

      it("matches a scoped assignment within its own scope", async () => {
        expect(await permissionsFor(scopedReaderHeaders, SCOPE)).toContain(
          "product:read"
        )
      })

      it("does not match a scoped assignment within a different scope", async () => {
        expect(await permissionsFor(scopedReaderHeaders, OTHER_SCOPE)).toEqual(
          []
        )
      })

      it("does not match a scoped assignment when the request carries no scope", async () => {
        // The strict behavior: with no scope resolved, only unscoped
        // assignments are considered.
        expect(await permissionsFor(scopedReaderHeaders)).toEqual([])
      })

      it("returns no permissions for an actor with no assignments, in or out of a scope", async () => {
        expect(await permissionsFor(noRolesHeaders)).toEqual([])
        expect(await permissionsFor(noRolesHeaders, SCOPE)).toEqual([])
      })
    })

    /**
     * Core sets no scope on requests, so the cases below drive the middleware
     * directly against the real container to put one on `req.rbac_context`.
     * That covers what the route-level tests above cannot: a guarded request
     * being allowed or rejected on the strength of its scope, and the
     * permissions the middleware hands to the route handler.
     */
    describe("scope enforcement through authorize", () => {
      const productRead: PolicyAction = {
        resource: "product",
        operation: PolicyOperation.read,
      }

      const runAuthorize = async ({
        actorId,
        scope,
        policies = productRead,
      }: {
        actorId: string
        scope?: typeof SCOPE
        policies?: PolicyAction | PolicyAction[]
      }) => {
        const req = {
          scope: container,
          auth_context: { actor_id: actorId, actor_type: "user" },
          ...(scope ? { rbac_context: { scope } } : {}),
        } as unknown as AuthenticatedMedusaRequest

        const next = jest.fn()
        const error = await authorize(policies)(
          req,
          {} as MedusaResponse,
          next
        ).then(
          () => undefined,
          (err) => err
        )

        return { req, next, error }
      }

      it("allows a scoped actor acting within its own scope", async () => {
        const { next, error } = await runAuthorize({
          actorId: scopedReaderId,
          scope: SCOPE,
        })

        expect(error).toBeUndefined()
        expect(next).toHaveBeenCalledWith()
      })

      it("forbids a scoped actor acting within a different scope", async () => {
        const { next, error } = await runAuthorize({
          actorId: scopedReaderId,
          scope: OTHER_SCOPE,
        })

        expect(error).toMatchObject({
          type: MedusaError.Types.FORBIDDEN,
          message: "Forbidden",
        })
        expect(next).not.toHaveBeenCalled()
      })

      it("forbids a scoped actor when the request carries no scope", async () => {
        const { next, error } = await runAuthorize({ actorId: scopedReaderId })

        expect(error).toMatchObject({ type: MedusaError.Types.FORBIDDEN })
        expect(next).not.toHaveBeenCalled()
      })

      it("allows an unscoped actor acting within any scope", async () => {
        for (const scope of [SCOPE, OTHER_SCOPE, undefined]) {
          const { next, error } = await runAuthorize({
            actorId: unscopedReaderId,
            scope,
          })

          expect(error).toBeUndefined()
          expect(next).toHaveBeenCalledWith()
        }
      })

      it("forbids an actor with no assignments, scope or not", async () => {
        for (const scope of [SCOPE, undefined]) {
          const { error } = await runAuthorize({ actorId: noRolesId, scope })

          expect(error).toMatchObject({ type: MedusaError.Types.FORBIDDEN })
        }
      })

      it("forbids a scoped actor within its scope for a policy its role does not grant", async () => {
        const { error } = await runAuthorize({
          actorId: scopedReaderId,
          scope: SCOPE,
          policies: { resource: "product", operation: PolicyOperation.delete },
        })

        expect(error).toMatchObject({ type: MedusaError.Types.FORBIDDEN })
        expect(error.message).toContain("product:delete")
      })

      it("exposes the guarding policies and the resolved permissions on the rbac context", async () => {
        const { req } = await runAuthorize({
          actorId: scopedReaderId,
          scope: SCOPE,
        })

        expect(req.rbac_context).toEqual({
          scope: SCOPE,
          policies: [productRead],
          permissions: ["product:read"],
        })
      })
    })
  },
})
