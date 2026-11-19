import { Modules, PolicyOperation } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const readerHeaders = { headers: { ...adminHeaders.headers } }
    const runnerHeaders = { headers: { ...adminHeaders.headers } }

    const statusOf = (request: Promise<{ status: number }>) =>
      request
        .then((response) => response.status)
        .catch((error) => error.response.status)

    const run = (headers: typeof adminHeaders) =>
      api.post("/admin/workflows-executions/nope/run", {}, headers)

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)

      const createUserWith = async (
        name: string,
        headers: typeof adminHeaders,
        operations: string[]
      ) => {
        const policies = await rbacModule.listRbacPolicies({
          resource: "workflow_execution",
          operation: operations,
        })
        const role = await rbacModule.createRbacRoles({ name })
        await rbacModule.createRbacRolePolicies(
          policies.map((policy) => ({ role_id: role.id, policy_id: policy.id }))
        )
        await createAdminUser(dbConnection, headers, container, {
          email: `${name.toLowerCase().replace(/ /g, "-")}@medusa.js`,
          roles: [role.id],
        })
      }

      await createUserWith("Workflow Reader", readerHeaders, [
        PolicyOperation.read,
      ])
      await createUserWith("Workflow Runner", runnerHeaders, [
        PolicyOperation.read,
        PolicyOperation.create,
      ])

      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    describe("POST /admin/workflows-executions/:workflow_id/run", () => {
      it("forbids a role without workflow_execution:create", async () => {
        expect(await statusOf(run(readerHeaders))).toEqual(403)
      })

      it("lets a role holding workflow_execution:create past the policy check", async () => {
        // The workflow doesn't exist, so the request fails after authorization.
        expect(await statusOf(run(runnerHeaders))).not.toEqual(403)
      })
    })
  },
})
