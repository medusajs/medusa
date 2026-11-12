import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { Modules } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { ensureSuperAdminRemainsStep } from "../ensure-super-admin-remains"

const makeContainer = (superAdminAssignmentIds: string[]) => {
  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.RBAC,
    asFunction(
      () =>
        ({
          listRbacRoleAssignments: () =>
            Promise.resolve(superAdminAssignmentIds.map((id) => ({ id }))),
        } as any)
    )
  )

  return container
}

const run = (
  name: string,
  superAdminAssignmentIds: string[],
  excluded: string[]
) => {
  const workflow = createWorkflow(name, () => {
    return new WorkflowResponse(
      ensureSuperAdminRemainsStep({ excluded_assignment_ids: excluded })
    )
  })

  return workflow(makeContainer(superAdminAssignmentIds)).run({
    input: {},
    throwOnError: false,
  })
}

describe("ensureSuperAdminRemainsStep", () => {
  beforeAll(() => {
    jest.spyOn(MedusaModule, "isInstalled").mockReturnValue(true)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("refuses to remove the last super admin", async () => {
    const { errors } = await run("guard-last", ["rasgn_1"], ["rasgn_1"])

    expect(errors[0].error.message).toContain(
      "Cannot remove the last super admin"
    )
  })

  it("allows removing a super admin when another remains", async () => {
    const { errors } = await run(
      "guard-another-remains",
      ["rasgn_1", "rasgn_2"],
      ["rasgn_1"]
    )

    expect(errors).toEqual([])
  })

  it("allows removals that don't touch a super admin, even when no user is one", async () => {
    const { errors } = await run("guard-no-super-admin", [], ["rasgn_other"])

    expect(errors).toEqual([])
  })
})
