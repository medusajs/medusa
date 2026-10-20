import { Clock, jittered } from "../runtime/clock"

export interface PeriodicTask {
  name: string
  everyMs: number
  run(): Promise<unknown>
}

const PERIOD_JITTER = 0.1

/**
 * Runs tasks on fixed intervals, each up to 10% shorter. A run never overlaps the previous run of the
 * same task.
 */
export class PeriodicTasks {
  #handles = new Map<string, unknown>()
  #running = new Map<string, Promise<unknown>>()
  #stopped = true

  constructor(
    private readonly clock: Clock,
    private readonly onError: (message: string, error: unknown) => void
  ) {}

  start(tasks: PeriodicTask[]) {
    this.#stopped = false
    for (const task of tasks) {
      this.#schedule(task, 0)
    }
  }

  async stop() {
    this.#stopped = true
    for (const handle of this.#handles.values()) {
      this.clock.clearTimeout(handle)
    }
    this.#handles.clear()
    await Promise.allSettled([...this.#running.values()])
  }

  #schedule(task: PeriodicTask, delay: number) {
    if (this.#stopped) {
      return
    }
    const handle = this.clock.setTimeout(() => {
      this.#handles.delete(task.name)
      const running = task
        .run()
        .catch((error) =>
          this.onError(`Periodic task "${task.name}" failed`, error)
        )
        .finally(() => {
          this.#running.delete(task.name)
          this.#schedule(task, jittered(task.everyMs, PERIOD_JITTER))
        })
      this.#running.set(task.name, running)
    }, delay)
    ;(handle as { unref?: () => void })?.unref?.()
    this.#handles.set(task.name, handle)
  }
}
