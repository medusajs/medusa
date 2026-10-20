import { setTimeout as wait } from "timers/promises"
import { createTestDatabase } from "../utils/database"
import { spawnWorker, WorkerProcess } from "../utils/workers"

jest.setTimeout(60_000)

describe("several engine processes on one database", () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>
  let workers: WorkerProcess[] = []

  const spawn = async (
    name: string,
    options: { mode?: string; schedule?: boolean } = {}
  ) => {
    const worker = await spawnWorker(name, {
      databaseUrl: database.url,
      ...options,
    })
    workers.push(worker)
    return worker
  }

  const events = async (workflow: string, step?: string) => {
    const { rows } = await database.pool.query(
      `SELECT instance, step, attempt, payload FROM test_event
       WHERE workflow = $1 AND ($2::text IS NULL OR step = $2)
       ORDER BY id`,
      [workflow, step ?? null]
    )
    return rows as Array<{
      instance: string
      step: string
      attempt: number
      payload: any
    }>
  }

  const run = async (workflowId: string, transactionId: string) => {
    const { rows } = await database.pool.query(
      `SELECT status, result::text AS result FROM workflow_run
       WHERE workflow_id = $1 AND transaction_id = $2
       ORDER BY created_at DESC LIMIT 1`,
      [workflowId, transactionId]
    )
    return rows[0] as { status: string; result: string } | undefined
  }

  const until = async (check: () => Promise<boolean>, timeoutMs = 15_000) => {
    const start = Date.now()
    while (!(await check())) {
      if (Date.now() - start > timeoutMs) {
        throw new Error("Condition not met in time")
      }
      await wait(50)
    }
  }

  beforeEach(async () => {
    database = await createTestDatabase()
    await database.pool.query(`
      CREATE TABLE test_event (
        id serial PRIMARY KEY, instance text, workflow text, step text,
        attempt int, payload jsonb, at timestamptz DEFAULT now()
      );
      CREATE TABLE test_signal (name text PRIMARY KEY);
    `)
  })

  afterEach(async () => {
    for (const worker of workers) {
      worker.kill("SIGKILL")
    }
    workers = []
    await database.drop()
  })

  it("rejects the second of two concurrent starts of one transaction id", async () => {
    const [a, b] = await Promise.all([spawn("server-a"), spawn("server-b")])
    const results = await Promise.allSettled(
      [a, b].map((server) =>
        server.call("start", {
          workflowId: "confirm",
          transactionId: "same",
          await: true,
        })
      )
    )
    const rejected = results.filter((r) => r.status === "rejected")
    expect(rejected).toHaveLength(1)
    expect((rejected[0] as PromiseRejectedResult).reason.message).toContain(
      "Transaction already started for transactionId: same"
    )
  })

  it("resumes a run on another process after its process is killed mid-step", async () => {
    const a = await spawn("a")
    await spawn("b")

    await a.call("start", {
      workflowId: "crash-sync",
      transactionId: "t",
      input: { sleepOn: "a" },
    })
    await until(async () => (await events("crash-sync", "slow")).length === 1)
    a.kill("SIGKILL")

    await until(
      async () => (await run("crash-sync", "t"))?.status === "succeeded"
    )
    expect((await events("crash-sync", "a")).map((e) => e.instance)).toEqual([
      "a",
    ])
    expect((await events("crash-sync", "slow")).map((e) => e.instance)).toEqual(
      ["a", "b"]
    )
    expect(JSON.parse((await run("crash-sync", "t"))!.result)).toEqual("b")
  })

  it("re-runs a background step whose process died", async () => {
    const a = await spawn("a")
    await spawn("b")

    await a.call("start", {
      workflowId: "crash-background",
      transactionId: "t",
      input: { sleepOn: "a" },
    })
    await until(
      async () => (await events("crash-background", "background")).length === 1
    )
    a.kill("SIGKILL")

    await until(
      async () => (await run("crash-background", "t"))?.status === "succeeded"
    )
    expect(
      (await events("crash-background", "background")).map((e) => e.instance)
    ).toEqual(["a", "b"])
  })

  it("leaves async steps to workers and lets a completion on a server reach them", async () => {
    const server = await spawn("server", { mode: "server" })
    await spawn("worker", { mode: "worker" })

    const started = await server.call("start", {
      workflowId: "confirm",
      transactionId: "t",
      await: true,
    })
    expect(started.status).toEqual("waiting")

    const waiting = async () => {
      const { rows } = await database.pool.query(
        `SELECT s.status FROM workflow_step s JOIN workflow_run r ON r.id = s.run_id
         WHERE r.transaction_id = 't' AND s.step_id = 'confirm'`
      )
      return rows[0]?.status === "waiting"
    }
    await until(waiting)

    await server.call("completeStep", {
      target: { workflowId: "confirm", transactionId: "t", stepId: "confirm" },
      result: { output: "ok" },
    })

    await until(async () => (await run("confirm", "t"))?.status === "succeeded")
    expect((await events("confirm")).map((e) => [e.step, e.instance])).toEqual([
      ["before", "server"],
      ["after", "worker"],
    ])
  })

  it("handles a retry timer once with three workers polling", async () => {
    const server = await spawn("server", { mode: "server" })
    await Promise.all([
      spawn("w1", { mode: "worker" }),
      spawn("w2", { mode: "worker" }),
      spawn("w3", { mode: "worker" }),
    ])

    await server.call("start", {
      workflowId: "retry-once",
      transactionId: "t",
      await: true,
    })
    await until(async () => (await events("retry-once", "work")).length === 1)

    await server.call("failStep", {
      target: { workflowId: "retry-once", transactionId: "t", stepId: "work" },
      message: "try again",
    })

    await until(
      async () => (await run("retry-once", "t"))?.status === "succeeded"
    )
    // Nothing is left that could run the step again.
    await until(async () => {
      const { rows } = await database.pool.query(
        `SELECT
           (SELECT count(*) FROM workflow_timer t
            JOIN workflow_run r ON r.id = t.run_id
            WHERE r.workflow_id = 'retry-once')::int AS timers,
           (SELECT count(*) FROM workflow_run
            WHERE workflow_id = 'retry-once' AND lease_token IS NOT NULL)::int
             AS leases`
      )
      return rows[0].timers === 0 && rows[0].leases === 0
    })
    const attempts = (await events("retry-once", "work")).map((e) => e.attempt)
    expect(attempts).toEqual([1, 2])
  })

  it("fires each schedule time once across three workers", async () => {
    await Promise.all([
      spawn("w1", { mode: "worker", schedule: true }),
      spawn("w2", { mode: "worker", schedule: true }),
      spawn("w3", { mode: "worker", schedule: true }),
    ])

    await until(async () => (await events("scheduled", "fire")).length >= 2)

    const fires = (await events("scheduled", "fire")).map(
      (e) => e.payload.scheduledFor
    )
    expect(fires.length).toBeGreaterThanOrEqual(2)
    expect(new Set(fires).size).toEqual(fires.length)
  })

  it("fences off a process that paused past its lease", async () => {
    const a = await spawn("a")
    await spawn("b")

    await a.call("start", { workflowId: "fenced", transactionId: "t" })
    await until(async () => (await events("fenced", "gate-start")).length === 1)

    // A long pause: no heartbeats, so the lease runs out and b takes over.
    a.kill("SIGSTOP")
    await database.pool.query(
      `INSERT INTO test_signal (name) VALUES ('fenced')`
    )
    await until(async () => (await run("fenced", "t"))?.status === "succeeded")
    expect(JSON.parse((await run("fenced", "t"))!.result)).toEqual("b")

    // a wakes up, finishes its step and cannot write.
    a.kill("SIGCONT")
    await until(async () =>
      (await events("fenced", "gate-end")).some((e) => e.instance === "a")
    )
    // Its write after the step was refused.
    await until(async () =>
      (await events("lease", "lost")).some((e) => e.instance === "a")
    )
    const stored = await run("fenced", "t")
    expect(stored!.status).toEqual("succeeded")
    expect(JSON.parse(stored!.result)).toEqual("b")
  })

  it("hands runs over at once on graceful shutdown", async () => {
    const a = await spawn("a")
    await spawn("b")

    await a.call("start", { workflowId: "fenced", transactionId: "t" })
    await until(async () => (await events("fenced", "gate-start")).length === 1)

    await a.call("shutdown", { graceMs: 50 }).catch(() => undefined)
    await until(async () =>
      (await events("fenced", "gate-start")).some((e) => e.instance === "b")
    )
    await database.pool.query(
      `INSERT INTO test_signal (name) VALUES ('fenced')`
    )

    await until(async () => (await run("fenced", "t"))?.status === "succeeded")
    expect(JSON.parse((await run("fenced", "t"))!.result)).toEqual("b")
  })
})
