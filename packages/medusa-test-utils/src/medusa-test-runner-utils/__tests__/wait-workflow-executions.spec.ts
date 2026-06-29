import { waitWorkflowExecutions } from "../wait-workflow-executions"

function createContainer(sequence: { id: string }[][]) {
  let call = 0
  const listWorkflowExecutions = jest.fn(async () => {
    const value = sequence[Math.min(call, sequence.length - 1)]
    call++
    return value
  })
  const container = {
    resolve: () => ({ listWorkflowExecutions }),
  } as any
  return { container, listWorkflowExecutions }
}

describe("waitWorkflowExecutions", () => {
  it("returns immediately when no workflow engine is registered", async () => {
    const container = { resolve: () => undefined } as any
    await expect(waitWorkflowExecutions(container)).resolves.toBeUndefined()
  })

  it("keeps waiting past a transient empty reading while a follow-on workflow is still imminent (#15836)", async () => {
    // A parent workflow clears (2nd poll empty), but a subscriber-triggered
    // follow-on appears on the next poll before things finally settle.
    const { container, listWorkflowExecutions } = createContainer([
      [{ id: "wfe_parent" }],
      [], // transient gap right after the parent finished
      [{ id: "wfe_followon" }], // background follow-on workflow appeared
      [],
      [],
      [],
      [],
      [],
    ])

    await waitWorkflowExecutions(container)

    // The single-shot implementation stopped on the first empty reading (after 2
    // polls) and never observed wfe_followon. With a settle window the wait
    // keeps polling, so it sees the follow-on before concluding.
    expect(listWorkflowExecutions.mock.calls.length).toBeGreaterThan(2)
    const observed = (
      await Promise.all(listWorkflowExecutions.mock.results.map((r) => r.value))
    ).flat()
    expect(observed.some((e) => e?.id === "wfe_followon")).toBe(true)
  })
})
