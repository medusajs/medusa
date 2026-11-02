import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import createSuperAdminRole from "../create-super-admin-role"

describe("createSuperAdminRole", () => {
  const users = [
    { id: "user_1", email: "first@example.com" },
    { id: "user_2", email: "second@example.com" },
    { id: "user_3" },
  ]

  let logger: Record<string, jest.Mock>
  let link: { create: jest.Mock }
  let container: { resolve: jest.Mock }

  beforeEach(() => {
    jest.spyOn(MedusaModule, "isInstalled").mockReturnValue(true)

    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    }
    link = { create: jest.fn().mockResolvedValue(undefined) }

    const services = {
      [ContainerRegistrationKeys.LOGGER]: logger,
      [ContainerRegistrationKeys.LINK]: link,
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

    expect(link.create).toHaveBeenCalledTimes(users.length)

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
