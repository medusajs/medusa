import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { assignRolesWorkflow } from "@medusajs/core-flows"
import createSuperAdminRole from "../create-super-admin-role"

jest.mock("@medusajs/core-flows", () => ({
  assignRolesWorkflow: jest.fn(),
}))

describe("createSuperAdminRole", () => {
  const users = [
    { id: "user_1", email: "first@example.com" },
    { id: "user_2", email: "second@example.com" },
    { id: "user_3" },
  ]

  let logger: Record<string, jest.Mock>
  let run: jest.Mock
  let container: { resolve: jest.Mock }

  beforeEach(() => {
    jest.spyOn(MedusaModule, "isInstalled").mockReturnValue(true)

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    }
    run = jest.fn().mockResolvedValue({})
    jest.mocked(assignRolesWorkflow).mockReturnValue({ run } as any)

    const services = {
      [ContainerRegistrationKeys.LOGGER]: logger,
      [Modules.USER]: { listUsers: jest.fn().mockResolvedValue(users) },
      [Modules.RBAC]: {
        listRbacRoles: jest
          .fn()
          .mockResolvedValue([{ id: "role_super_admin", name: "Super Admin" }]),
        listRbacRolePolicies: jest.fn().mockResolvedValue([{ id: "policy" }]),
      },
    }

    container = { resolve: jest.fn((key: string) => services[key]) }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should identify users by id only and never log their emails", async () => {
    await createSuperAdminRole({ container } as any)

    expect(run).toHaveBeenCalledTimes(users.length)
    for (const user of users) {
      expect(run).toHaveBeenCalledWith({
        input: {
          assignments: [
            {
              role_id: "role_super_admin",
              reference: Modules.USER,
              reference_id: user.id,
            },
          ],
        },
      })
    }

    const logged = Object.values(logger)
      .flatMap((fn) => fn.mock.calls)
      .flat()
      .map(String)
      .join("\n")

    for (const user of users) {
      expect(logged).toContain(user.id)
    }
    expect(logged).not.toContain("@example.com")
  })
})
