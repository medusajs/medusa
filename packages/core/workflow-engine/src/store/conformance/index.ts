import { setTimeout as wait } from "timers/promises"
import { LeaseLostError } from "../../errors"
import {
  IdPolicy,
  NewRun,
  NewTimer,
  OutboxRetryPolicy,
  OutboxRow,
  Store,
} from "../store"

export interface ConformanceContext {
  store: Store
}

let counter = 0
// How recently a worker must have heartbeated to count as alive.
const LIVE_MS = 60_000
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++counter}`

function newRun(overrides: Partial<NewRun> = {}): NewRun {
  return {
    id: uid("run"),
    workflowId: "conformance",
    transactionId: uid("trx"),
    status: "running",
    durability: "full",
    definitionHash: "hash",
    input: { at: new Date("2026-01-01T00:00:00.000Z"), big: BigInt(10) },
    context: { eventGroupId: "group" },
    metadata: {},
    errors: [],
    flags: {},
    idempotent: false,
    ...overrides,
  }
}

const UNIQUE: IdPolicy = { unique: true, idempotent: false }
const LEASE = { owner: "conformance", ttlMs: 30_000 }

/**
 * The behaviour every store must have. Call it inside a test file with a
 * factory for a store over an empty database. With `multiProcess: false`,
 * recovery and cross-instance bookkeeping that a single-process store skips
 * are not checked.
 */
export function runStoreConformance(
  name: string,
  setup: () => Promise<ConformanceContext>,
  teardown?: () => Promise<void>,
  options: { multiProcess?: boolean } = {}
) {
  const multiProcessIt = options.multiProcess === false ? it.skip : it

  describe(`${name} store conformance`, () => {
    let store: Store

    beforeAll(async () => {
      store = (await setup()).store
    })

    afterAll(async () => {
      await teardown?.()
    })

    async function created(run = newRun(), policy = UNIQUE) {
      const result = await store.createRun(run, policy, LEASE)
      if (result.kind !== "created") {
        throw new Error(`Expected a new run, got ${result.kind}`)
      }
      return result
    }

    it("keeps values round trip", async () => {
      const { run } = await created()
      const loaded = await store.loadRun(run.id)
      expect(loaded!.input).toEqual({
        at: new Date("2026-01-01T00:00:00.000Z"),
        big: BigInt(10),
      })
      expect(loaded!.context).toEqual({ eventGroupId: "group" })
    })

    it("rejects a second active run for a transaction id", async () => {
      const first = newRun()
      await created(first)
      const second = await store.createRun(
        newRun({ transactionId: first.transactionId }),
        UNIQUE,
        LEASE
      )
      expect(second.kind).toEqual("running")
      expect(second.run.id).toEqual(first.id)
    })

    it("lets exactly one of two concurrent starts win", async () => {
      const transactionId = uid("trx")
      const results = await Promise.all([
        store.createRun(newRun({ transactionId }), UNIQUE, LEASE),
        store.createRun(newRun({ transactionId }), UNIQUE, LEASE),
      ])
      expect(results.map((r) => r.kind).sort()).toEqual(["created", "running"])
    })

    it("keeps one active run per workflow and transaction id, whatever the policy", async () => {
      const NOT_UNIQUE: IdPolicy = { unique: false, idempotent: false }
      const first = await created()
      const second = await store.createRun(
        newRun({ transactionId: first.run.transactionId }),
        NOT_UNIQUE,
        LEASE
      )
      expect(second.kind).toEqual("running")
      expect(second.run.id).toEqual(first.run.id)

      await store.commit(first.lease!, { status: "succeeded", finished: true })
      const third = await store.createRun(
        newRun({ transactionId: first.run.transactionId }),
        NOT_UNIQUE,
        LEASE
      )
      expect(third.kind).toEqual("created")
    })

    it("skips the check for ids that are not unique", async () => {
      const first = newRun()
      await created(first)
      const second = await store.createRun(
        newRun({ transactionId: first.transactionId, workflowId: "other" }),
        { unique: false, idempotent: false },
        LEASE
      )
      expect(second.kind).toEqual("created")
    })

    it("returns a finished idempotent run and starts over otherwise", async () => {
      const { run, lease } = await created(newRun({ retentionMs: 60_000 }))
      await store.commit(lease!, {
        status: "succeeded",
        result: { ok: true },
        finished: true,
        steps: [
          {
            stepId: "a",
            status: "succeeded",
            attempt: 1,
            output: "a",
            compensateInput: "a",
          },
        ],
      })

      const idempotent = await store.createRun(
        newRun({ transactionId: run.transactionId }),
        { unique: true, idempotent: true },
        LEASE
      )
      expect(idempotent.kind).toEqual("finished")
      expect(idempotent.run.result).toEqual({ ok: true })
      expect(idempotent.run.steps).toHaveLength(1)

      const again = await store.createRun(
        newRun({ transactionId: run.transactionId }),
        UNIQUE,
        LEASE
      )
      expect(again.kind).toEqual("created")
    })

    it("fences writes on the lease token", async () => {
      const { run, lease } = await created()
      await expect(
        store.commit({ ...lease!, token: "stale" }, { status: "waiting" })
      ).rejects.toBeInstanceOf(LeaseLostError)

      expect(await store.acquireLease(run.id, "other", 1000)).toEqual({
        ok: false,
        reason: "held",
      })
      expect(await store.acquireLease(uid("missing"), "other", 1000)).toEqual({
        ok: false,
        reason: "missing",
      })
      await store.releaseLease(lease!)
      const acquired = await store.acquireLease(run.id, "other", 1000)
      expect(acquired.ok).toEqual(true)
      const next = acquired.ok ? acquired.lease : null

      await expect(
        store.commit(lease!, { status: "waiting" })
      ).rejects.toBeInstanceOf(LeaseLostError)
      await expect(store.commit(next!, { status: "waiting" })).resolves.toEqual(
        { cancelRequested: false }
      )
    })

    it("hands an expired lease to another owner", async () => {
      const { run } = await store.createRun(newRun(), UNIQUE, {
        owner: "a",
        ttlMs: 1,
      })
      await wait(20)
      expect((await store.acquireLease(run.id, "b", 1000)).ok).toEqual(true)
    })

    it("upserts step rows and tells output apart from no output", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [
          { stepId: "a", status: "running", attempt: 1 },
          {
            stepId: "b",
            status: "succeeded",
            attempt: 1,
            output: undefined,
            compensateInput: { id: 1 },
          },
        ],
      })
      await store.commit(lease!, {
        steps: [
          {
            stepId: "a",
            status: "succeeded",
            attempt: 1,
            output: { when: new Date("2026-02-01T00:00:00.000Z") },
            compensateInput: null,
            startedAt: new Date("2026-02-01T00:00:00.000Z"),
          },
        ],
      })

      const loaded = await store.loadRun(run.id, { steps: true })
      const byId = Object.fromEntries(loaded!.steps!.map((s) => [s.stepId, s]))
      expect(byId.a.status).toEqual("succeeded")
      expect(byId.a.output).toEqual({
        when: new Date("2026-02-01T00:00:00.000Z"),
      })
      expect(new Date(byId.a.startedAt!).toISOString()).toEqual(
        "2026-02-01T00:00:00.000Z"
      )
      expect(byId.b.output).toBeUndefined()
      expect(byId.b.compensateInput).toEqual({ id: 1 })
    })

    it("completes a waiting step exactly once, without a lease", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [{ stepId: "confirm", status: "waiting", attempt: 1 }],
      })

      const results = await Promise.all([
        store.completeWaitingStep(run.id, "confirm", {
          kind: "output",
          output: 1,
          compensateInput: 1,
        }),
        store.completeWaitingStep(run.id, "confirm", {
          kind: "output",
          output: 2,
          compensateInput: 2,
        }),
      ])
      expect(results.filter((r) => r.ok)).toHaveLength(1)
      expect(results.find((r) => !r.ok)!.status).toEqual("succeeded")
    })

    it("completes a waiting step only for the expected attempt and owner", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [{ stepId: "a", status: "waiting", attempt: 2, owner: "w" }],
      })
      const output = { kind: "output" as const, output: 1, compensateInput: 1 }

      expect(
        await store.completeWaitingStep(run.id, "a", output, undefined, {
          attempt: 1,
        })
      ).toEqual({ ok: false, status: "waiting" })
      expect(
        await store.completeWaitingStep(run.id, "a", output, undefined, {
          attempt: 2,
          owner: "other",
        })
      ).toEqual({ ok: false, status: "waiting" })

      const result = await store.completeWaitingStep(
        run.id,
        "a",
        output,
        undefined,
        { attempt: 2, owner: "w" }
      )
      expect(result.ok).toBe(true)
      expect(result.status).toEqual("succeeded")
    })

    it("clears the owner of a waiting step only for its attempt", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [{ stepId: "a", status: "waiting", attempt: 2, owner: "w" }],
      })
      const owner = async () =>
        (await store.loadRun(run.id, { steps: true }))!.steps![0].owner ?? null

      await store.clearStepOwner(run.id, "a", 1)
      expect(await owner()).toEqual("w")
      await store.clearStepOwner(run.id, "a", 2)
      expect(await owner()).toBeNull()
    })

    it("records an outside failure for the executor to apply", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [{ stepId: "confirm", status: "waiting", attempt: 1 }],
      })
      await store.completeWaitingStep(run.id, "confirm", {
        kind: "failure",
        error: { message: "nope" },
        permanent: true,
      })

      const step = (await store.loadRun(run.id, { steps: true }))!.steps![0]
      expect(step.status).toEqual("failed")
      expect(step.error).toEqual({ message: "nope" })
      expect(step.pendingFailure).toEqual({ permanent: true })
    })

    it("moves a waiting or retry_scheduled step back to pending", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [{ stepId: "a", status: "retry_scheduled", attempt: 1 }],
      })
      expect(await store.requestStepRetry(run.id, "a")).toEqual({
        ok: true,
        status: "pending",
      })
      expect((await store.requestStepRetry(run.id, "a")).ok).toBe(false)
    })

    it("moves only a retry_scheduled step when asked, and deletes the given timers with it", async () => {
      const { run, lease } = await created(newRun({ workflowId: uid("retry") }))
      const retryId = `retry:${run.id}:a`
      await store.commit(lease!, {
        steps: [{ stepId: "a", status: "waiting", attempt: 2 }],
        timers: [
          {
            id: retryId,
            kind: "retry",
            runId: run.id,
            stepId: "a",
            workflowId: run.workflowId,
            definitionHash: "hash",
            dueAt: new Date(Date.now() - 1000),
          },
        ],
      })
      expect(
        await store.requestStepRetry(run.id, "a", undefined, {
          scheduledOnly: true,
          deleteTimers: [retryId],
        })
      ).toEqual({ ok: false, status: "waiting" })

      await store.commit(lease!, {
        steps: [{ stepId: "a", status: "retry_scheduled", attempt: 2 }],
      })
      expect(
        (
          await store.requestStepRetry(run.id, "a", undefined, {
            scheduledOnly: true,
            deleteTimers: [retryId],
          })
        ).ok
      ).toBe(true)
      expect(
        await store.claimDueTimers(
          "a",
          10,
          [{ workflowId: run.workflowId, hash: "hash" }],
          { claimMs: 30_000, mismatchGraceMs: 60_000 }
        )
      ).not.toContainEqual(expect.objectContaining({ id: retryId }))
    })

    it("touches the run when a step is completed or retried from outside", async () => {
      const workflowId = uid("touch")
      const first = await created(newRun({ workflowId }))
      await store.commit(first.lease!, {
        steps: [{ stepId: "a", status: "waiting", attempt: 1 }],
      })
      await wait(20)
      const second = await created(newRun({ workflowId }))
      await wait(20)

      const order = async () =>
        (
          await store.queryRuns({ workflowId }, { orderBy: "updated_at" })
        )[0].map((r) => r.id)

      expect(await order()).toEqual([second.run.id, first.run.id])
      await store.completeWaitingStep(first.run.id, "a", {
        kind: "output",
        output: 1,
        compensateInput: 1,
      })
      expect(await order()).toEqual([first.run.id, second.run.id])
    })

    it("reports a cancel request on the next commit", async () => {
      const { run, lease } = await created()
      await store.requestCancel(run.id)
      await expect(store.commit(lease!, {})).resolves.toEqual({
        cancelRequested: true,
      })
    })

    it("reports the cancel request as it stands after the commit", async () => {
      const cleared = await created()
      await store.requestCancel(cleared.run.id)
      await expect(
        store.commit(cleared.lease!, { cancelRequestedAt: null })
      ).resolves.toEqual({ cancelRequested: false })

      const deleted = await created()
      await store.requestCancel(deleted.run.id)
      await expect(
        store.commit(deleted.lease!, { status: "cancelled", delete: true })
      ).resolves.toEqual({ cancelRequested: true })
    })

    it("deletes a run and its steps in the final commit", async () => {
      const { run, lease } = await created()
      await store.commit(lease!, {
        steps: [{ stepId: "a", status: "succeeded", attempt: 1 }],
      })
      await store.commit(lease!, { status: "succeeded", delete: true })
      expect(await store.loadRun(run.id)).toBeNull()
    })

    it("prefers the active run when finding by transaction id", async () => {
      const first = await created(newRun({ retentionMs: 60_000 }))
      await store.commit(first.lease!, { status: "failed", finished: true })
      const second = await created(
        newRun({ transactionId: first.run.transactionId })
      )
      const found = await store.findRun("conformance", first.run.transactionId)
      expect(found!.id).toEqual(second.run.id)
    })

    it("filters, pages and counts runs", async () => {
      const workflowId = uid("query")
      for (let i = 0; i < 3; i++) {
        await created(newRun({ workflowId, transactionId: `needle-${i}` }))
      }
      await created(newRun({ workflowId, transactionId: "other" }))

      const [page, count] = await store.queryRuns(
        { workflowId, q: "needle" },
        { limit: 2, offset: 0 }
      )
      expect(count).toEqual(3)
      expect(page).toHaveLength(2)

      const [running] = await store.queryRuns({
        workflowId,
        statusNot: ["running"],
      })
      expect(running).toHaveLength(0)
    })

    it("orders runs by creation or last update", async () => {
      const workflowId = uid("order")
      const first = await created(newRun({ workflowId }))
      await wait(20)
      const second = await created(newRun({ workflowId }))
      await wait(20)
      await store.commit(first.lease!, { context: { touched: true } })

      const ids = async (page: Parameters<Store["queryRuns"]>[1]) =>
        (await store.queryRuns({ workflowId }, page))[0].map((run) => run.id)

      expect(await ids({})).toEqual([second.run.id, first.run.id])
      expect(await ids({ orderBy: "created_at", order: "asc" })).toEqual([
        first.run.id,
        second.run.id,
      ])
      expect(await ids({ orderBy: "updated_at" })).toEqual([
        first.run.id,
        second.run.id,
      ])
      expect(await ids({ orderBy: "updated_at", order: "asc" })).toEqual([
        second.run.id,
        first.run.id,
      ])
    })

    it("deletes finished runs whose retention has passed", async () => {
      const { run, lease } = await created(newRun({ retentionMs: 1 }))
      await store.commit(lease!, { status: "succeeded", finished: true })
      await wait(20)
      expect(await store.deleteExpired()).toBeGreaterThanOrEqual(1)
      expect(await store.loadRun(run.id)).toBeNull()
    })

    it("deletes expired runs in batches with their timers, and nothing else", async () => {
      const workflowId = uid("retention")
      const known = [{ workflowId, hash: "hash" }]
      const expired = await Promise.all([
        created(newRun({ workflowId, retentionMs: 1 })),
        created(newRun({ workflowId, retentionMs: 1 })),
      ])
      for (const { run, lease } of expired) {
        await store.commit(lease!, {
          status: "succeeded",
          finished: true,
          timers: [
            {
              id: `resume:${run.id}`,
              kind: "resume",
              runId: run.id,
              workflowId,
              definitionHash: "hash",
              dueAt: new Date(Date.now() - 1000),
            },
          ],
        })
      }
      const kept = await created(newRun({ workflowId, retentionMs: 60_000 }))
      await store.commit(kept.lease!, { status: "succeeded", finished: true })
      const active = await created(newRun({ workflowId, retentionMs: 1 }))
      await wait(20)

      expect(
        await store.deleteExpired({ batchSize: 1 })
      ).toBeGreaterThanOrEqual(2)
      for (const { run } of expired) {
        expect(await store.loadRun(run.id)).toBeNull()
      }
      expect(await store.loadRun(kept.run.id)).not.toBeNull()
      expect(await store.loadRun(active.run.id)).not.toBeNull()
      expect(
        await store.claimDueTimers("a", 10, known, {
          claimMs: 30_000,
          mismatchGraceMs: 60_000,
        })
      ).toEqual([])
    })
    describe("timers", () => {
      const timer = (overrides: Partial<NewTimer> = {}): NewTimer => ({
        id: uid("timer"),
        kind: "resume",
        runId: uid("run"),
        workflowId: "timers",
        definitionHash: "hash",
        dueAt: new Date(Date.now() - 1000),
        ...overrides,
      })
      const KNOWN = [{ workflowId: "timers", hash: "hash" }]
      const CLAIM = { claimMs: 30_000, mismatchGraceMs: 60_000 }

      async function drain() {
        for (;;) {
          const claimed = await store.claimDueTimers("drain", 100, KNOWN, CLAIM)
          if (!claimed.length) {
            return
          }
          for (const t of claimed) {
            await store.completeTimer(t.id, t.generation!)
          }
        }
      }

      beforeEach(drain)

      it("claims due timers once and leaves future ones", async () => {
        const due = timer()
        const later = timer({ dueAt: new Date(Date.now() + 60_000) })
        await store.scheduleTimers([due, later])

        const [first, second] = await Promise.all([
          store.claimDueTimers("a", 10, KNOWN, CLAIM),
          store.claimDueTimers("b", 10, KNOWN, CLAIM),
        ])
        const claimed = [...first, ...second].map((t) => t.id)
        expect(claimed).toEqual([due.id])
      })

      it("only claims timers of definitions the caller knows", async () => {
        await store.scheduleTimers([
          timer({ workflowId: "unknown" }),
          timer({ definitionHash: "other" }),
        ])
        expect(await store.claimDueTimers("a", 10, KNOWN, CLAIM)).toEqual([])
        const afterGrace = await store.claimDueTimers("a", 10, KNOWN, {
          ...CLAIM,
          mismatchGraceMs: 0,
        })
        expect(afterGrace).toHaveLength(1)
        expect(afterGrace[0].definitionHash).toEqual("other")
      })

      it("lets a claim expire so another owner can take the timer", async () => {
        await store.scheduleTimers([timer()])
        expect(
          await store.claimDueTimers("a", 10, KNOWN, { ...CLAIM, claimMs: 1 })
        ).toHaveLength(1)
        await wait(20)
        expect(await store.claimDueTimers("b", 10, KNOWN, CLAIM)).toHaveLength(
          1
        )
      })

      it("keeps a timer that was written again while it was handled", async () => {
        const due = timer()
        await store.scheduleTimers([due])
        const [claimed] = await store.claimDueTimers("a", 10, KNOWN, CLAIM)

        await store.scheduleTimers([due])
        expect(await store.completeTimer(due.id, claimed.generation!)).toBe(
          false
        )

        const [again] = await store.claimDueTimers("b", 10, KNOWN, CLAIM)
        expect(again.id).toEqual(due.id)
        expect(again.generation).toBeGreaterThan(claimed.generation!)
        expect(await store.completeTimer(due.id, again.generation!)).toBe(true)
      })

      it("keeps the earlier due time when a timer is written again", async () => {
        const early = timer({ dueAt: new Date(Date.now() - 5000) })
        await store.scheduleTimers([early])
        await store.scheduleTimers([
          { ...early, dueAt: new Date(Date.now() + 60_000) },
        ])
        const [claimed] = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        expect(claimed.id).toEqual(early.id)
      })

      it("defers a claimed timer", async () => {
        await store.scheduleTimers([timer()])
        const [claimed] = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        await store.deferTimer(claimed.id, claimed.generation!, 60_000)
        expect(await store.claimDueTimers("b", 10, KNOWN, CLAIM)).toEqual([])
        expect(await store.completeTimer(claimed.id, claimed.generation!)).toBe(
          true
        )
      })

      it("writes a timer together with a step completion", async () => {
        const { run, lease } = await created(newRun({ workflowId: "timers" }))
        await store.commit(lease!, {
          steps: [{ stepId: "a", status: "waiting", attempt: 1 }],
        })
        const result = await store.completeWaitingStep(
          run.id,
          "a",
          { kind: "output", output: 1, compensateInput: 1 },
          timer({ id: `resume:${run.id}`, runId: run.id })
        )
        expect(result.timerGeneration).toEqual(1)

        const failed = await store.completeWaitingStep(
          run.id,
          "a",
          { kind: "output", output: 1, compensateInput: 1 },
          timer({ id: `resume-2:${run.id}`, runId: run.id })
        )
        expect(failed.ok).toBe(false)
        const claimed = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        expect(claimed.map((t) => t.id)).toEqual([`resume:${run.id}`])
      })

      it("only moves a timer that exists earlier when asked to", async () => {
        const due = timer()
        await store.scheduleTimers([due])
        const [claimed] = await store.claimDueTimers("a", 10, KNOWN, CLAIM)

        await store.scheduleTimers([{ ...due, dueAt: new Date() }], {
          onlyEarlier: true,
        })
        expect(await store.completeTimer(due.id, claimed.generation!)).toBe(
          true
        )

        const later = timer({ dueAt: new Date(Date.now() + 60_000) })
        await store.scheduleTimers([later])
        await store.scheduleTimers(
          [{ ...later, dueAt: new Date(Date.now() - 1000) }],
          {
            onlyEarlier: true,
          }
        )
        const [moved] = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        expect(moved.id).toEqual(later.id)
      })

      it("claims a timer of another definition once the grace has passed", async () => {
        const mismatched = timer({ definitionHash: "other" })
        await store.scheduleTimers([
          mismatched,
          timer({ workflowId: "unknown" }),
        ])
        expect(await store.claimDueTimers("a", 10, KNOWN, CLAIM)).toEqual([])
        await wait(100)
        const claimed = await store.claimDueTimers("a", 10, KNOWN, {
          ...CLAIM,
          mismatchGraceMs: 50,
        })
        expect(claimed.map((t) => t.id)).toEqual([mismatched.id])
      })

      it("writes a timer together with a cancel request", async () => {
        const { run } = await created(newRun({ workflowId: "timers" }))
        await store.requestCancel(
          run.id,
          timer({ id: `resume:${run.id}`, runId: run.id })
        )
        expect((await store.loadRun(run.id))!.cancelRequestedAt).toBeTruthy()

        await store.requestCancel(uid("run"), timer())

        const claimed = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        expect(claimed.map((t) => t.id)).toEqual([`resume:${run.id}`])
      })

      it("deletes every timer of a run it deletes, and writes none", async () => {
        const { run, lease } = await created(newRun({ workflowId: "timers" }))
        await store.commit(lease!, { timers: [timer({ runId: run.id })] })
        await store.commit(lease!, {
          status: "succeeded",
          delete: true,
          timers: [timer({ runId: run.id })],
        })
        const claimed = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        expect(claimed.filter((t) => t.runId === run.id)).toEqual([])
      })

      it("deletes a run's timers in its final commit", async () => {
        const { run, lease } = await created(newRun({ workflowId: "timers" }))
        await store.commit(lease!, {
          timers: [timer({ runId: run.id })],
        })
        await store.commit(lease!, {
          status: "succeeded",
          finished: true,
          deleteRunTimers: true,
        })
        const claimed = await store.claimDueTimers("a", 10, KNOWN, CLAIM)
        expect(claimed.filter((t) => t.runId === run.id)).toEqual([])
      })
    })

    describe("schedules", () => {
      const spec = (workflowId: string, overrides = {}) => ({
        workflowId,
        intervalMs: 1000,
        concurrency: "forbid" as const,
        numberOfExecutions: 3,
        catchUp: true,
        definitionHash: "hash",
        ...overrides,
      })

      it("keeps the next fire across re-registration of the same spec", async () => {
        const id = uid("schedule")
        const first = new Date(Date.now() - 1000)
        await store.upsertSchedule(spec(id), first)
        await store.upsertSchedule(spec(id), new Date(Date.now() + 60_000))
        const [claimed] = await store.claimDueSchedules("a", 10, [id], 30_000)
        expect(claimed.schedule.nextFireAt!.getTime()).toEqual(first.getTime())
        expect(claimed.schedule.remaining).toEqual(3)
        await store.advanceSchedule(id, "a", {
          nextFireAt: first,
          remaining: 3,
          lastTransactionId: null,
        })

        await store.upsertSchedule(spec(id, { intervalMs: 2000 }), null)
        expect(await store.claimDueSchedules("a", 10, [id], 30_000)).toEqual([])
      })

      it("hands a due schedule to one owner and advances it", async () => {
        const id = uid("schedule")
        await store.upsertSchedule(spec(id), new Date(Date.now() - 1000))

        const [a, b] = await Promise.all([
          store.claimDueSchedules("a", 10, [id], 30_000),
          store.claimDueSchedules("b", 10, [id], 30_000),
        ])
        expect(a.length + b.length).toEqual(1)
        const owner = a.length ? "a" : "b"

        expect(
          await store.advanceSchedule(id, owner === "a" ? "b" : "a", {
            nextFireAt: null,
            remaining: 0,
            lastTransactionId: null,
          })
        ).toBe(false)
        expect(
          await store.advanceSchedule(id, owner, {
            nextFireAt: new Date(Date.now() - 1000),
            remaining: 0,
            lastTransactionId: "trx",
          })
        ).toBe(true)

        // No executions left.
        expect(await store.claimDueSchedules("a", 10, [id], 30_000)).toEqual([])
      })

      it("starts over when the spec changes", async () => {
        const id = uid("schedule")
        const first = new Date(Date.now() - 1000)
        await store.upsertSchedule(spec(id), first)
        const [claimed] = await store.claimDueSchedules("a", 10, [id], 30_000)
        expect(claimed.schedule.remaining).toEqual(3)
        await store.advanceSchedule(id, "a", {
          nextFireAt: first,
          remaining: 1,
          lastTransactionId: "trx",
        })

        await store.upsertSchedule(spec(id), new Date(Date.now() + 60_000))
        const [kept] = await store.claimDueSchedules("a", 10, [id], 30_000)
        expect(kept.schedule.remaining).toEqual(1)
        await store.advanceSchedule(id, "a", {
          nextFireAt: first,
          remaining: 1,
          lastTransactionId: "trx",
        })

        const next = new Date(Date.now() - 500)
        await store.upsertSchedule(spec(id, { numberOfExecutions: 5 }), next)
        const [reset] = await store.claimDueSchedules("a", 10, [id], 30_000)
        expect(reset.schedule.remaining).toEqual(5)
        expect(reset.schedule.nextFireAt!.getTime()).toEqual(next.getTime())
        expect(reset.schedule.lastTransactionId).toEqual("trx")
      })

      multiProcessIt("keeps schedules that are touched", async () => {
        const touched = uid("schedule")
        const untouched = uid("schedule")
        const due = new Date(Date.now() - 1000)
        await store.upsertSchedule(spec(touched), due)
        await store.upsertSchedule(spec(untouched), due)
        await wait(50)
        const cutoff = await store.now()
        await wait(50)
        await store.touchSchedules([touched])

        await store.deleteStaleSchedules(cutoff)
        const claimed = await store.claimDueSchedules(
          "a",
          10,
          [touched, untouched],
          30_000
        )
        expect(claimed.map((c) => c.schedule.workflowId)).toEqual([touched])
      })

      multiProcessIt(
        "removes schedules nobody has seen for a while",
        async () => {
          const id = uid("schedule")
          await store.upsertSchedule(spec(id), new Date(Date.now() - 1000))
          expect(
            await store.deleteStaleSchedules(new Date(Date.now() + 1000))
          ).toBeGreaterThanOrEqual(1)
          expect(await store.claimDueSchedules("a", 10, [id], 30_000)).toEqual(
            []
          )
        }
      )
    })

    describe("recovery", () => {
      multiProcessIt(
        "schedules a resume once for runs whose lease expired",
        async () => {
          const expired = await store.createRun(newRun(), UNIQUE, {
            owner: "dead",
            ttlMs: 1,
          })
          const held = await store.createRun(newRun(), UNIQUE, {
            owner: "alive",
            ttlMs: 60_000,
          })
          await wait(20)

          const found = await store.scheduleExpiredLeaseResumes(1000, LIVE_MS)
          expect(found).toContain(expired.run.id)
          expect(found).not.toContain(held.run.id)
          expect(
            await store.scheduleExpiredLeaseResumes(1000, LIVE_MS)
          ).not.toContain(expired.run.id)

          expect(await store.releaseLeasesOf("alive")).toEqual([held.run.id])
          expect(
            await store.scheduleExpiredLeaseResumes(1000, LIVE_MS)
          ).toContain(held.run.id)
        }
      )

      multiProcessIt(
        "keeps a lease held while its owner heartbeats",
        async () => {
          const owner = uid("owner")
          const { run } = await store.createRun(newRun(), UNIQUE, {
            owner,
            ttlMs: 1,
          })
          await store.heartbeat(
            { id: owner, mode: "worker" },
            { liveMs: LIVE_MS }
          )
          await wait(20)

          expect((await store.acquireLease(run.id, "other", LIVE_MS)).ok).toBe(
            false
          )
          expect(
            await store.scheduleExpiredLeaseResumes(1000, LIVE_MS)
          ).not.toContain(run.id)

          // Its heartbeat is older than a shorter liveness window.
          expect((await store.acquireLease(run.id, "other", 5)).ok).toBe(true)
        }
      )

      multiProcessIt(
        "names the live worker with the lowest id as the reaper",
        async () => {
          const suffix = uid("")
          // "!" sorts before every other id these tests use.
          const server = `!a-server${suffix}`
          const worker = `!b-worker${suffix}`
          await store.heartbeat(
            { id: server, mode: "server" },
            { liveMs: LIVE_MS }
          )
          expect(
            await store.heartbeat(
              { id: worker, mode: "worker" },
              { liveMs: LIVE_MS }
            )
          ).toEqual({ reaper: worker })
          expect(
            await store.heartbeat(
              { id: server, mode: "server" },
              { liveMs: LIVE_MS }
            )
          ).toEqual({ reaper: worker })
          await store.removeWorker(server)
          await store.removeWorker(worker)
        }
      )

      multiProcessIt(
        "gives concurrent reapers different expired runs",
        async () => {
          const runs = await Promise.all(
            Array.from({ length: 20 }, () =>
              store.createRun(newRun(), UNIQUE, { owner: "dead", ttlMs: 1 })
            )
          )
          await wait(20)

          const batches = await Promise.all(
            Array.from({ length: 4 }, () =>
              store.scheduleExpiredLeaseResumes(5, LIVE_MS)
            )
          )
          const claimed = batches.flat()
          expect(new Set(claimed).size).toEqual(claimed.length)
          for (const { run } of runs) {
            const again = await store.scheduleExpiredLeaseResumes(1000, LIVE_MS)
            expect(again).not.toContain(run.id)
          }
        }
      )

      multiProcessIt(
        "moves background steps of dead instances back to pending",
        async () => {
          const { run, lease } = await created()
          await store.heartbeat(
            { id: "live-worker", mode: "worker" },
            { liveMs: LIVE_MS }
          )
          await store.commit(lease!, {
            steps: [
              { stepId: "dead", status: "waiting", attempt: 1, owner: "gone" },
              {
                stepId: "live",
                status: "waiting",
                attempt: 1,
                owner: "live-worker",
              },
              {
                stepId: "cleared",
                status: "waiting",
                attempt: 1,
                owner: "gone",
              },
            ],
          })
          await store.clearStepOwner(run.id, "cleared", 1)

          const recovered = await store.recoverOrphanedSteps(
            new Date(Date.now() - 60_000)
          )
          expect(recovered).toContain(run.id)

          const steps = Object.fromEntries(
            (await store.loadRun(run.id, { steps: true }))!.steps!.map((s) => [
              s.stepId,
              s.status,
            ])
          )
          expect(steps).toEqual({
            dead: "pending",
            live: "waiting",
            cleared: "waiting",
          })
        }
      )

      it("releases every lease of an owner and no other", async () => {
        const owner = uid("owner")
        const mine = await Promise.all([
          store.createRun(newRun(), UNIQUE, { owner, ttlMs: 60_000 }),
          store.createRun(newRun(), UNIQUE, { owner, ttlMs: 60_000 }),
        ])
        const other = await store.createRun(newRun(), UNIQUE, {
          owner: uid("owner"),
          ttlMs: 60_000,
        })

        expect((await store.releaseLeasesOf(owner)).sort()).toEqual(
          mine.map((r) => r.run.id).sort()
        )
        expect((await store.acquireLease(other.run.id, "x", 1000)).ok).toEqual(
          false
        )
        expect(await store.releaseLeasesOf(owner)).toEqual([])
      })

      multiProcessIt(
        "schedules the longest expired leases first and skips runs with a resume timer",
        async () => {
          const first = await store.createRun(newRun(), UNIQUE, {
            owner: "dead",
            ttlMs: 1,
          })
          await wait(10)
          const second = await store.createRun(newRun(), UNIQUE, {
            owner: "dead",
            ttlMs: 1,
          })
          const resuming = await store.createRun(newRun(), UNIQUE, {
            owner: "dead",
            ttlMs: 1,
          })
          await store.scheduleTimers([
            {
              id: `resume:${resuming.run.id}`,
              kind: "resume",
              runId: resuming.run.id,
              workflowId: resuming.run.workflowId,
              definitionHash: "hash",
              dueAt: new Date(),
            },
          ])
          await wait(20)

          // Other tests leave expired runs behind, so take them one at a time.
          const order: string[] = []
          for (let i = 0; i < 1000 && !order.includes(second.run.id); i++) {
            order.push(...(await store.scheduleExpiredLeaseResumes(1, LIVE_MS)))
          }
          expect(order.indexOf(first.run.id)).toBeGreaterThanOrEqual(0)
          expect(order.indexOf(first.run.id)).toBeLessThan(
            order.indexOf(second.run.id)
          )
          expect(order).not.toContain(resuming.run.id)
        }
      )

      multiProcessIt("deletes workers that stopped heartbeating", async () => {
        const { run, lease } = await created()
        const worker = uid("worker")
        await store.heartbeat(
          { id: worker, mode: "worker" },
          { liveMs: LIVE_MS }
        )
        await store.commit(lease!, {
          steps: [
            { stepId: "a", status: "waiting", attempt: 1, owner: worker },
          ],
        })

        await store.deleteStaleWorkers(new Date(Date.now() - 60_000))
        expect(
          await store.recoverOrphanedSteps(new Date(Date.now() - 60_000))
        ).not.toContain(run.id)

        expect(
          await store.deleteStaleWorkers(new Date(Date.now() + 60_000))
        ).toBeGreaterThanOrEqual(1)
        expect(
          await store.recoverOrphanedSteps(new Date(Date.now() - 60_000))
        ).toContain(run.id)
      })

      it("can take a held lease by force", async () => {
        const { run } = await created()
        expect((await store.acquireLease(run.id, "other", 1000)).ok).toEqual(
          false
        )
        expect(
          (await store.acquireLease(run.id, "other", 1000, { force: true })).ok
        ).toEqual(true)
      })
    })

    describe("outbox", () => {
      const CLAIM_MS = 30_000

      const rows = (groupId: string, runId = uid("run")) => {
        const row = (
          suffix: string,
          overrides: Partial<OutboxRow> = {}
        ): OutboxRow => ({
          id: `${groupId}-${suffix}`,
          groupId,
          runId,
          stepId: "s",
          attempt: 1,
          message: { name: suffix },
          ...overrides,
        })
        return row
      }

      it("claims ready messages once, oldest first", async () => {
        const group = uid("group")
        const row = rows(group)
        await store.stageOutbox([row("c"), row("a"), row("b")])
        expect(await store.claimOutbox("a", 10, CLAIM_MS, group)).toEqual([])

        await store.markOutboxReady(group)
        const claimed = await store.claimOutbox("a", 2, CLAIM_MS, group)
        expect(claimed).toEqual([row("a"), row("b")])
        const rest = await store.claimOutbox("b", 10, CLAIM_MS, group)
        expect(rest.map((r) => r.id)).toEqual([row("c").id])
        expect(await store.claimOutbox("c", 10, CLAIM_MS, group)).toEqual([])
      })

      it("lets a claim expire and only deletes rows the owner still claims", async () => {
        const group = uid("group")
        const row = rows(group)
        await store.stageOutbox([row("a")])
        await store.markOutboxReady(group)

        expect(await store.claimOutbox("a", 10, 1, group)).toHaveLength(1)
        await wait(20)
        expect(await store.claimOutbox("b", 10, 1, group)).toHaveLength(1)

        await store.deleteOutboxIds([row("a").id], "a")
        await wait(20)
        expect(await store.claimOutbox("c", 10, CLAIM_MS, group)).toHaveLength(
          1
        )
        await store.deleteOutboxIds([row("a").id], "c")
        await wait(20)
        expect(await store.claimOutbox("d", 10, 1, group)).toEqual([])
      })

      it("defers messages that failed to publish", async () => {
        const group = uid("group")
        const row = rows(group)
        await store.stageOutbox([row("a"), row("b")])
        await store.markOutboxReady(group)

        await store.claimOutbox("a", 10, 1, group)
        await store.deferOutbox([row("a").id], "a", 60_000)
        await store.deferOutbox([row("b").id], "other", 60_000)
        await wait(20)

        const claimed = await store.claimOutbox("b", 10, CLAIM_MS, group)
        expect(claimed.map((r) => r.id)).toEqual([row("b").id])
      })

      it("backs off messages that failed to publish, by attempt", async () => {
        const group = uid("group")
        const row = rows(group)
        await store.stageOutbox([row("a"), row("b")])
        await store.markOutboxReady(group)
        const policy: OutboxRetryPolicy = {
          baseDelayMs: 60_000,
          maxDelayMs: 60_000,
          maxAttempts: 10,
        }

        expect(await store.claimOutbox("a", 1, 1, group)).toEqual([row("a")])
        expect(
          await store.failOutbox(
            [
              { id: row("a").id, error: { message: "boom" } },
              { id: row("b").id, error: { message: "not mine" } },
            ],
            "a",
            policy
          )
        ).toEqual([])
        await wait(20)

        // The failure keeps `a` claimed past its 1ms claim, for the backoff.
        // Failures of rows the owner does not claim are ignored.
        const claimed = await store.claimOutbox("b", 10, CLAIM_MS, group)
        expect(claimed.map((r) => r.id)).toEqual([row("b").id])
        expect(
          await store.failOutbox(
            [{ id: row("b").id, error: { message: "stolen" } }],
            "a",
            policy
          )
        ).toEqual([])
        expect(await store.claimOutbox("c", 10, CLAIM_MS, group)).toEqual([])
      })

      it("makes a message dead after the last attempt and never claims it again", async () => {
        const group = uid("group")
        const row = rows(group)
        await store.stageOutbox([row("a")])
        await store.markOutboxReady(group)
        const policy: OutboxRetryPolicy = {
          baseDelayMs: 1,
          maxDelayMs: 1,
          maxAttempts: 2,
        }

        expect(await store.claimOutbox("a", 10, CLAIM_MS, group)).toHaveLength(
          1
        )
        expect(
          await store.failOutbox(
            [{ id: row("a").id, error: { message: "first" } }],
            "a",
            policy
          )
        ).toEqual([])
        await wait(20)

        expect(await store.claimOutbox("a", 10, CLAIM_MS, group)).toHaveLength(
          1
        )
        const dead = await store.failOutbox(
          [{ id: row("a").id, error: { message: "second" } }],
          "a",
          policy
        )
        expect(dead).toEqual([
          { ...row("a"), attempts: 2, lastError: { message: "second" } },
        ])
        await wait(20)

        expect(await store.claimOutbox("a", 10, CLAIM_MS, group)).toEqual([])
        await store.markOutboxReady(group)
        expect(await store.claimOutbox("a", 10, CLAIM_MS, group)).toEqual([])
        expect(
          await store.failOutbox(
            [{ id: row("a").id, error: { message: "again" } }],
            "a",
            policy
          )
        ).toEqual([])

        const swept = await store.deleteOrphans({
          limit: 1000,
          outboxStaleMs: 24 * 60 * 60_000,
          deadOutboxRetentionMs: 0,
        })
        expect(swept).toBeGreaterThanOrEqual(1)
      })

      it("deletes messages by filter", async () => {
        const group = uid("group")
        const run = uid("run")
        const row = rows(group, run)
        const otherRun = rows(group)
        await store.stageOutbox([
          row("a-keep"),
          row("b-attempt", { attempt: 2 }),
          row("c-step", { stepId: "t" }),
          otherRun("d-name"),
          otherRun("e-keep"),
        ])

        await store.deleteOutbox({ runId: run, stepId: "s", attempt: 2 })
        await store.deleteOutbox({ runId: run, stepId: "t" })
        await store.deleteOutbox({ groupId: group, names: ["d-name"] })
        await store.deleteOutbox({})

        await store.markOutboxReady(group)
        const claimed = await store.claimOutbox("a", 10, CLAIM_MS, group)
        expect(claimed.map((r) => r.id)).toEqual([
          row("a-keep").id,
          otherRun("e-keep").id,
        ])
      })

      it("readies or discards groups with a run's final commit", async () => {
        const ready = uid("group")
        const discarded = uid("group")
        const deletedReady = uid("group")

        const kept = await created()
        await store.stageOutbox([
          rows(ready, kept.run.id)("a"),
          rows(discarded, kept.run.id)("a"),
        ])
        await store.commit(kept.lease!, {
          status: "succeeded",
          finished: true,
          outbox: { readyGroup: ready, discardGroup: discarded },
        })

        const deleted = await created()
        await store.stageOutbox([rows(deletedReady, deleted.run.id)("a")])
        await store.commit(deleted.lease!, {
          status: "succeeded",
          delete: true,
          outbox: { readyGroup: deletedReady },
        })

        expect(await store.claimOutbox("a", 10, CLAIM_MS, ready)).toHaveLength(
          1
        )
        expect(
          await store.claimOutbox("a", 10, CLAIM_MS, deletedReady)
        ).toHaveLength(1)
        await store.markOutboxReady(discarded)
        expect(await store.claimOutbox("a", 10, CLAIM_MS, discarded)).toEqual(
          []
        )
      })

      it("writes messages with a commit and claims a published group in the final one", async () => {
        const group = uid("group")
        const discarded = uid("group")
        const { run, lease } = await created()
        const other = rows(group)
        const mine = rows(group, run.id)

        await store.commit(lease!, { outbox: { stage: [mine("b")] } })
        expect(await store.claimOutbox("x", 10, CLAIM_MS, group)).toEqual([])
        await store.stageOutbox([other("a")])

        const result = await store.commit(lease!, {
          status: "succeeded",
          finished: true,
          outbox: {
            stage: [mine("c"), rows(discarded, run.id)("a")],
            readyGroup: group,
            discardGroup: discarded,
            claim: { owner: "me", claimMs: CLAIM_MS },
          },
        })

        expect(result.claimedOutbox).toEqual([other("a"), mine("b"), mine("c")])
        expect(await store.claimOutbox("x", 10, CLAIM_MS, group)).toEqual([])
        await store.markOutboxReady(discarded)
        expect(await store.claimOutbox("x", 10, CLAIM_MS, discarded)).toEqual(
          []
        )

        await store.deleteOutboxIds(
          result.claimedOutbox!.map((row) => row.id),
          "me"
        )
        await wait(20)
        expect(await store.claimOutbox("x", 10, 1, group)).toEqual([])
      })

      it("claims a published group with the commit that deletes its run", async () => {
        const group = uid("group")
        const { run, lease } = await created()
        const result = await store.commit(lease!, {
          status: "succeeded",
          delete: true,
          outbox: {
            stage: [rows(group, run.id)("a")],
            readyGroup: group,
            claim: { owner: "me", claimMs: CLAIM_MS },
          },
        })
        expect(result.claimedOutbox).toEqual([rows(group, run.id)("a")])
      })

      it("writes nothing for a commit whose lease was lost", async () => {
        const group = uid("group")
        const { run, lease } = await created()
        await store.acquireLease(run.id, "thief", 60_000, { force: true })
        await expect(
          store.commit(lease!, {
            outbox: { stage: [rows(group, run.id)("a")], readyGroup: group },
          })
        ).rejects.toThrow()
        await store.markOutboxReady(group)
        expect(await store.claimOutbox("x", 10, CLAIM_MS, group)).toEqual([])
      })

      it("sweeps stale staged messages of groups without a stored run", async () => {
        const orphaned = uid("group")
        const alive = uid("group")
        const published = uid("group")
        const { run } = await created()

        await store.stageOutbox([
          rows(orphaned)("a"),
          rows(alive, run.id)("a"),
          rows(alive)("b"),
          rows(published)("a"),
        ])
        await store.markOutboxReady(published)
        await wait(20)

        await store.deleteOrphans({ limit: 1000, outboxStaleMs: 0 })

        for (const group of [orphaned, alive]) {
          await store.markOutboxReady(group)
        }
        expect(await store.claimOutbox("a", 10, CLAIM_MS, orphaned)).toEqual([])
        expect(await store.claimOutbox("a", 10, CLAIM_MS, alive)).toHaveLength(
          2
        )
        expect(
          await store.claimOutbox("a", 10, CLAIM_MS, published)
        ).toHaveLength(1)
      })
    })
  })
}
