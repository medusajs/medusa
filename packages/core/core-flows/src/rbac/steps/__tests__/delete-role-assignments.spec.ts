import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { FeatureFlag, Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { deleteRoleAssignmentsStep } from "../delete-role-assignments"

// Forces the workflow to roll back so the delete step's compensation runs.
const failingStep = createStep(
  "delete-role-assignments-spec-failing-step",
  async () => {
    throw new Error("fail to trigger compensation")
  }
)

type Recorded = {
  listFilters: any[]
  deleted: (string | string[])[]
  created: any[]
  clearedTags: string[][]
}

const makeContainer = (existingRows: any[], recorded: Recorded) => {
  const container = createContainer() as unknown as MedusaContainer

  container.register(
    Modules.RBAC,
    asFunction(
      () =>
        ({
          listRbacRoleAssignments: (filters: any) => {
            recorded.listFilters.push(filters)
            const ids: string[] = filters?.id ?? []
            return Promise.resolve(
              existingRows.filter((row) => ids.includes(row.id))
            )
          },
          deleteRbacRoleAssignments: (ids: string | string[]) => {
            recorded.deleted.push(ids)
            return Promise.resolve()
          },
          createRbacRoleAssignments: (data: any) => {
            recorded.created.push(data)
            return Promise.resolve(data)
          },
        } as any)
    )
  )

  container.register(
    Modules.CACHING,
    asFunction(
      () =>
        ({
          clear: ({ tags }: { tags: string[] }) => {
            recorded.clearedTags.push(tags)
            return Promise.resolve()
          },
        } as any)
    )
  )

  return container
}

const emptyRecorded = (): Recorded => ({
  listFilters: [],
  deleted: [],
  created: [],
  clearedTags: [],
})

describe("deleteRoleAssignmentsStep", () => {
  beforeAll(() => {
    FeatureFlag.setFlag("rbac", true)
  })

  it("deletes the given ids and invalidates the affected references", async () => {
    const recorded = emptyRecorded()
    const container = makeContainer(
      [
        { id: "rasgn_1", reference: "user", reference_id: "usr_1" },
        { id: "rasgn_2", reference: "user", reference_id: "usr_2" },
        { id: "rasgn_3", reference: "invite", reference_id: "inv_1" },
      ],
      recorded
    )

    const workflow = createWorkflow("delete-role-assignments-by-ids", () => {
      return new WorkflowResponse(
        deleteRoleAssignmentsStep({ id: ["rasgn_1", "rasgn_3"] })
      )
    })

    await workflow(container).run({ input: {} })

    expect(recorded.listFilters).toEqual([{ id: ["rasgn_1", "rasgn_3"] }])
    expect(recorded.deleted).toEqual([["rasgn_1", "rasgn_3"]])
    // One tag per affected (reference, reference_id) pair.
    expect(recorded.clearedTags).toHaveLength(1)
    expect(recorded.clearedTags[0]).toHaveLength(2)
  })

  it("accepts a single id", async () => {
    const recorded = emptyRecorded()
    const container = makeContainer(
      [{ id: "rasgn_1", reference: "user", reference_id: "usr_1" }],
      recorded
    )

    const workflow = createWorkflow("delete-role-assignments-single-id", () => {
      return new WorkflowResponse(
        deleteRoleAssignmentsStep({ id: "rasgn_1" })
      )
    })

    await workflow(container).run({ input: {} })

    expect(recorded.listFilters).toEqual([{ id: ["rasgn_1"] }])
    expect(recorded.deleted).toEqual([["rasgn_1"]])
  })

  it("does nothing when no id is given", async () => {
    const recorded = emptyRecorded()
    const container = makeContainer([], recorded)

    const workflow = createWorkflow("delete-role-assignments-no-ids", () => {
      return new WorkflowResponse(deleteRoleAssignmentsStep({ id: [] }))
    })

    await workflow(container).run({ input: {} })

    expect(recorded.listFilters).toEqual([])
    expect(recorded.deleted).toEqual([])
  })

  it("does nothing when the ids match no assignment", async () => {
    const recorded = emptyRecorded()
    const container = makeContainer(
      [{ id: "rasgn_1", reference: "user", reference_id: "usr_1" }],
      recorded
    )

    const workflow = createWorkflow("delete-role-assignments-no-match", () => {
      return new WorkflowResponse(
        deleteRoleAssignmentsStep({ id: ["rasgn_missing"] })
      )
    })

    await workflow(container).run({ input: {} })

    expect(recorded.deleted).toEqual([])
    expect(recorded.clearedTags).toEqual([])
  })

  it("recreates the deleted rows on compensation", async () => {
    const recorded = emptyRecorded()
    const rows = [{ id: "rasgn_1", reference: "user", reference_id: "usr_1" }]
    const container = makeContainer(rows, recorded)

    const workflow = createWorkflow(
      "delete-role-assignments-compensation",
      () => {
        deleteRoleAssignmentsStep({ id: ["rasgn_1"] })
        failingStep()
        return new WorkflowResponse(void 0)
      }
    )

    await workflow(container)
      .run({ input: {} })
      .catch(() => void 0)

    expect(recorded.deleted).toEqual([["rasgn_1"]])
    expect(recorded.created).toEqual([rows])
  })
})
