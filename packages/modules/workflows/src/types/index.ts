export type WorkflowsNotifierOptions = { type: "redis"; url: string }

export type WorkflowsModuleOptions = {
  /**
   * Where runs are stored. Defaults to "postgres" when the app has a database
   * connection, "memory" otherwise. "postgres" without a database connection
   * fails on start.
   */
  store?: "postgres" | "memory"
  /**
   * Identifies this process in leases and heartbeats. Defaults to a new id
   * per process.
   */
  instanceId?: string
  /**
   * How often idle workers look for due work. Defaults to 1000 ms, or
   * 30000 ms with a notifier, when polling only catches lost wake-ups.
   */
  pollIntervalMs?: number
  /**
   * Faster wake-ups between instances. Polling is used when not set.
   */
  notifier?: WorkflowsNotifierOptions
  /**
   * Heartbeats and resuming runs of instances that died. On by default with
   * the Postgres store. `leaseTtlMs` is how long an instance may go without
   * a heartbeat before another instance takes over its runs.
   */
  recovery?:
    | false
    | {
        heartbeatIntervalMs?: number
        leaseTtlMs?: number
        reaperIntervalMs?: number
      }
  /**
   * Runs one instance takes on at once from timers and schedules.
   */
  maxConcurrentRuns?: number
  /**
   * How long shutdown waits for running steps before handing runs over.
   * Defaults to 10 seconds.
   */
  shutdownGraceMs?: number
}
