# Code Analysis

Steps 9c, 11, 12, and 12b: the per-file analysis pass, performance and bug checks, and verifying findings. Security (Step 10) is in `security-review.md`.

## Step 9c — Analysis Pass (ALL PRs)

Steps 10–12 run as one pass over the changed code, not three skims:

1. Order the changed non-test files by risk: API routes and middlewares,
   workflows and steps, module services and repositories, data models and
   migrations, subscribers and jobs, admin UI, then utilities.
2. For each file, read the full file and its diff hunks. When behavior
   depends on code outside the diff (a caller, a validator, a middleware,
   the service a route calls), find it with Grep/Glob and read it.
3. Run the security, performance, and bug checks below against the file's
   added lines, and note each candidate finding with its `path:line`.
4. Verify every candidate (Step 12b) before it reaches the decision.

## Step 11 — Performance Analysis (ALL PRs)

> **CRITICAL:** Only flag issues that would plausibly cause measurable degradation in production. Read full files before flagging. Only flag added (`+`) lines.

Check for:

**Database / Query Performance:**
- **N+1 queries** — `query.graph()`, `query.index()`, or service calls inside a loop over a result set
- **Unbounded queries** — `query.graph()` / `remoteQueryObjectFromString()` / list calls missing `pagination: req.queryConfig.pagination`
- **Missing pagination in response** — list routes omitting `count`, `offset`, `limit`
- **Missing database indexes** — new fields used in `filters` or `order` without a corresponding index

**Async & Concurrency:**
- Sequential `await` in a loop where `Promise.all()` would work
- Heavy synchronous computation in a hot path
- Unthrottled parallel operations that could overwhelm the DB connection pool

**Memory & Payload:**
- Loading large datasets into memory before filtering/transforming
- Deeply nested or unnecessarily large response payloads
- Accumulating across paginated batches without streaming

**Medusa-specific:**
- `query.graph()`, `query.index()`, or a module `retrieve*`/`list*` call
  inside a loop, including inside a workflow step's loop over items.
- `fields: ["*"]` or deep relation wildcards (`items.*.variant.*`) in store
  routes, cart, or checkout flows, where only a few fields are used.
- A service `list*` called from a route without `take`/pagination.
- A new model property used in `filters` or `order` without `.index()`
  on the data model (and its generated migration).
- Counting by loading rows (`(await list()).length`) instead of
  `listAndCount*` / a count query.
- Admin dashboard: queries that refetch on every render, lists without
  pagination, or a query per table row.

Report each blocking performance issue as a `[Performance]` blocking point
(see **Report Format**), quantifying the cost in the first line (e.g. "one
query per cart item").

Performance severity:
- **Blocking** (add `"requires-more"`): N+1, unbounded queries on large tables, missing pagination on list endpoints.
- **Non-blocking** (mention in `summary`, do not block): minor suggestions.

## Step 12 — Bug Detection (ALL PRs)

> **CRITICAL:** Applies to **all PRs**. Any potential bug — confirmed or suspected — is a **required change** and must result in `"requires-more"` in `labels_to_add` and `review_template: "needs-changes"`. Read full files before flagging. Only flag added (`+`) lines.

Look for:

- **Logic errors** — off-by-one, wrong conditionals, inverted booleans
- **Null / undefined access** without guards
- **Async issues** — missing `await`, unhandled rejections, races
- **Type mismatches**, unsafe casts, implicit coercions
- **Resource leaks** — unclosed connections, missing rollbacks, unhandled cleanup errors
- **Edge cases not handled** — empty arrays, zero values, missing validation
- **Mutation side-effects** on shared state or arguments
- **Incorrect error handling** — swallowed errors, wrong error types
- **Wrong HTTP status codes**
- **Workflow compensation gaps** — `createStep` with side effects but no compensation function

**Medusa-specific:**
- **Plain logic in a workflow body:** `createWorkflow`'s function runs once
  at composition time, so `if`, `.map`, arithmetic, `await`, or reading a
  step result's properties there silently uses references, not values.
  That logic belongs in `transform()` or `when()`, and the function must
  not be `async`.
- **Step compensation:** a step with a side effect but no compensation, a
  compensation that can't run twice safely, or a `StepResponse` that
  doesn't pass the data the compensation needs.
- **Transactions:** a public service method without `@InjectManager()`, a
  protected one without `@InjectTransactionManager()`, or a
  `sharedContext` that isn't passed down, so writes run outside the
  caller's transaction.
- **Data model change without a migration** generated in the same PR.
- **Money math** on amounts with JS numbers instead of `BigNumber`/`MathBN`.
- **Wrong `MedusaError` type**, which maps to the wrong HTTP status
  (e.g. `INVALID_DATA` for a missing record instead of `NOT_FOUND`).
- **Filters with `undefined` values** passed to `query.graph()` or `list*`,
  which drops the filter and returns every record.
- **Events** emitted outside `@EmitEvents()` or before the transaction
  commits; subscribers and jobs that aren't idempotent when retried.

Report each bug as a `[Bug]` blocking point (see **Report Format**) whose
first line states the failure: the input or state, and what goes wrong.

> Do NOT flag style issues, code smell, or naming preferences here.

## Step 12b — Verify Every Finding (ALL PRs)

A wrong finding costs more than a missed nit: it wastes the contributor's
time and teaches them to ignore the review. Before a candidate from Steps
9–12 goes into the decision, check all of these:

1. **It's on an added line.** Find the exact `+` line and its line number
   in the PR's version of the file (from the diff hunk header). No added
   line, no finding.
2. **You can state the failure concretely:** the input or state, and the
   wrong result, crash, exposure, or cost. If you can't name the input,
   drop it, or ask it as a question when it still worries you.
3. **It isn't already handled.** Read the validator in `middlewares.ts`,
   the guard in the caller, the DB constraint, or the framework default
   that might cover it.
4. **The PR doesn't already fix it** elsewhere in the diff.
5. **It isn't a duplicate.** Merge findings with one root cause into one
   blocking point.

Only findings that pass all five go into `blocking_points`. A suspected bug
that passes them is still a required change.

## Common Mistakes

- [ ] Reporting a finding that didn't pass Step 12b (not on an added line, no concrete input, already handled elsewhere)
- [ ] Missing a store route that returns data without an `allowed` fields list
- [ ] Missing plain JS logic (`if`, `.map`, `await`) inside a `createWorkflow` body instead of `transform()`/`when()`
- [ ] Skipping performance analysis — always check for N+1 queries and unbounded queries
- [ ] Flagging style/code smell as bugs
- [ ] Flagging issues in removed (`-`) or unchanged context lines
- [ ] Requesting a change that the PR already makes
