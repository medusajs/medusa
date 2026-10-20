import { checkLegacyExecutions } from "../check-legacy-executions"

type Row = { workflow_id: string; transaction_id: string }

function fakeClient(table: Row[] | null) {
  const queries: string[] = []
  const client = {
    queries,
    async query(sql: string): Promise<any> {
      queries.push(sql)
      if (sql.includes("to_regclass")) {
        return { rows: [{ exists: table ? "workflow_execution" : null }] }
      }
      const limit = Number(/LIMIT (\d+)/.exec(sql)![1])
      const rows = (table ?? [])
        .slice(0, limit)
        .map((row) => ({ ...row, total: String(table!.length) }))
      return { rows, rowCount: rows.length }
    },
  }
  return client
}

describe("checkLegacyExecutions", () => {
  it("does nothing without the legacy table", async () => {
    const client = fakeClient(null)
    const log = { warn: jest.fn() }

    await checkLegacyExecutions(client, log)

    expect(client.queries).toHaveLength(1)
    expect(log.warn).not.toHaveBeenCalled()
  })

  it("only warns, with at most 20 ids and the count of the rest", async () => {
    const client = fakeClient(
      Array.from({ length: 25 }, (_, i) => ({
        workflow_id: "wf",
        transaction_id: `t${i}`,
      }))
    )
    const log = { warn: jest.fn() }

    await checkLegacyExecutions(client, log)

    expect(log.warn).toHaveBeenCalledTimes(1)
    const message = log.warn.mock.calls[0][0] as string
    expect(message).toContain("25 unfinished executions")
    expect(message).toContain("wf:t19")
    expect(message).not.toContain("wf:t20")
    expect(message).toContain("and 5 more")
    expect(client.queries.every((sql) => sql.startsWith("SELECT"))).toBe(true)
  })
})
